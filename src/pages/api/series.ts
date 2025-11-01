import type { NextApiRequest, NextApiResponse } from 'next';
import { Series } from '@/types/cricket';
import { cricketApi } from '@/lib/cricketApi';
import { cache, generateCacheKey, Cache } from '@/lib/cache';

type ResponseData =
  | Series[]
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
    const { status } = req.query;

    const cacheKey = generateCacheKey('series', { status });

    // Check cache
    const cachedData = cache.get<Series[]>(cacheKey);
    if (cachedData) {
      res.status(200).json(cachedData);
      return;
    }

    // Fetch from API
    const series = await cricketApi.getSeries(
      status as string | undefined
    );

    // Cache the result
    cache.set(cacheKey, series, Cache.SERIES_TTL);

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

    res.status(200).json(series);
  } catch (error) {
    console.error('Error fetching series:', error);

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        res.status(504).json({ error: 'Request timeout. Please try again.' });
      } else {
        res.status(500).json({ error: 'Failed to fetch series. Please try again.' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch series. Please try again.' });
    }
  }
}
