import type { NextApiRequest, NextApiResponse } from 'next';
import { Match } from '@/types/cricket';
import { cricketApi } from '@/lib/cricketApi';
import { cache, generateCacheKey, Cache } from '@/lib/cache';

type ResponseData =
  | Match[]
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
    const { format, status, startDate, endDate, team } = req.query;

    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey('matches', {
      format,
      status,
      startDate,
      endDate,
      team,
    });

    // Check cache
    const cachedData = cache.get<Match[]>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    // Determine cache TTL based on status
    let cacheTTL = Cache.SCHEDULED_MATCHES_TTL;
    if (status === 'live') {
      cacheTTL = Cache.LIVE_MATCHES_TTL;
    }

    // Fetch from API
    const matches = await cricketApi.getMatches(
      format as string | undefined,
      status as string | undefined,
      startDate as string | undefined,
      endDate as string | undefined,
      team ? (typeof team === 'string' ? team.split(',') : team) : undefined
    );

    // Cache the result
    cache.set(cacheKey, matches, cacheTTL);

    // Set cache headers
    if (status === 'live') {
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        res.status(504).json({ error: 'Request timeout. Please try again.' });
      } else if (error.message.includes('API Error: 429')) {
        res.status(429).json({ error: 'Rate limited. Please try again later.' });
      } else {
        res.status(500).json({ error: 'Cricket data unavailable. Please try again later.' });
      }
    } else {
      res.status(500).json({ error: 'Cricket data unavailable. Please try again later.' });
    }
  }
}
