import type { NextApiRequest, NextApiResponse } from 'next';
import { MatchDetail } from '@/types/cricket';
import { cricketApi } from '@/lib/cricketApi';
import { cache, generateCacheKey, Cache } from '@/lib/cache';

type ResponseData =
  | MatchDetail
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
    res.status(400).json({ error: 'Match ID is required' });
    return;
  }

  try {
    const cacheKey = generateCacheKey('match', { id });

    // Check cache
    const cachedData = cache.get<MatchDetail>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    // Fetch from API
    const matchDetail = await cricketApi.getMatchDetail(id);

    if (!matchDetail) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    // Determine cache TTL based on status
    const cacheTTL =
      matchDetail.status === 'live'
        ? Cache.MATCH_DETAIL_LIVE_TTL
        : Cache.MATCH_DETAIL_COMPLETED_TTL;

    // Cache the result
    cache.set(cacheKey, matchDetail, cacheTTL);

    // Set cache headers
    if (matchDetail.status === 'live') {
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }

    res.status(200).json(matchDetail);
  } catch (error) {
    console.error(`Error fetching match ${id}:`, error);

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        res.status(504).json({ error: 'Request timeout. Please try again.' });
      } else {
        res.status(500).json({ error: 'Failed to fetch match details. Please try again.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch match details. Please try again.' });
    }
  }
}
