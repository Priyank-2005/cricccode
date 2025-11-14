import type { NextApiRequest, NextApiResponse } from 'next';
import { TeamDetail } from '@/types/cricket';
import { cricketApi } from '@/lib/cricketApi';
import { cache, generateCacheKey, Cache } from '@/lib/cache';

type ResponseData =
  | TeamDetail
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Team ID is required' });
    return;
  }

  try {
    const cacheKey = generateCacheKey('team', { id });

    // Check cache
    const cachedData = cache.get<TeamDetail>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    // Fetch from API
    const teamDetail = await cricketApi.getTeamDetail(id);

    if (!teamDetail) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Cache the result
    cache.set(cacheKey, teamDetail, Cache.TEAM_DETAIL_TTL);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=21600, stale-while-revalidate=86400');

    res.status(200).json(teamDetail);
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error);

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        res.status(504).json({ error: 'Request timeout. Please try again.' });
      } else {
        res.status(500).json({ error: 'Failed to fetch team details. Please try again.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch team details. Please try again.' });
    }
  }
}
