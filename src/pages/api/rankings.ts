import type { NextApiRequest, NextApiResponse } from 'next';
import { Rankings } from '@/types/cricket';
import { cricketApi } from '@/lib/cricketApi';
import { cache, generateCacheKey, Cache } from '@/lib/cache';

type ResponseData =
  | Rankings
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
    const { type, format, category } = req.query;

    const cacheKey = generateCacheKey('rankings', { type, format, category });

    // Check cache
    const cachedData = cache.get<Rankings>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    // Fetch from API
    const rankings = await cricketApi.getRankings(
      (type as 'teams' | 'players') || 'teams',
      format as any,
      category as any
    );

    if (!rankings) {
      res.status(404).json({ error: 'Rankings not found' });
      return;
    }

    // Cache the result
    cache.set(cacheKey, rankings, Cache.RANKINGS_TTL);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    res.status(200).json(rankings);
  } catch (error) {
    console.error('Error fetching rankings:', error);

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        res.status(504).json({ error: 'Request timeout. Please try again.' });
      } else {
        res.status(500).json({ error: 'Failed to fetch rankings. Please try again.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch rankings. Please try again.' });
    }
  }
}
