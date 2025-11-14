import type { NextApiRequest, NextApiResponse } from 'next';
import { TeamInfo } from '@/types/cricket';
import { cricketApi } from '@/lib/cricketApi';
import { cache, generateCacheKey, Cache } from '@/lib/cache';

type ResponseData =
  | TeamInfo[]
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const cacheKey = generateCacheKey('teams', {});

    // Check cache
    const cachedData = cache.get<TeamInfo[]>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    // Fetch from API
    const teams = await cricketApi.getTeams();

    // Cache the result
    cache.set(cacheKey, teams, Cache.TEAMS_TTL);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        res.status(504).json({ error: 'Request timeout. Please try again.' });
      } else {
        res.status(500).json({ error: 'Failed to fetch teams. Please try again.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch teams. Please try again.' });
    }
  }
}
