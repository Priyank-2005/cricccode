// In-memory cache implementation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in seconds
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    const ageSeconds = (now - entry.timestamp) / 1000;

    if (ageSeconds > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // Cache TTL constants (in seconds)
  static readonly LIVE_MATCHES_TTL = 5 * 60; // 5 minutes
  static readonly SCHEDULED_MATCHES_TTL = 60 * 60; // 1 hour
  static readonly MATCH_DETAIL_LIVE_TTL = 2 * 60; // 2 minutes
  static readonly MATCH_DETAIL_COMPLETED_TTL = 24 * 60 * 60; // 1 day
  static readonly SERIES_TTL = 60 * 60; // 1 hour
  static readonly TEAMS_TTL = 24 * 60 * 60; // 24 hours
  static readonly TEAM_DETAIL_TTL = 6 * 60 * 60; // 6 hours
  static readonly RANKINGS_TTL = 24 * 60 * 60; // 24 hours
}

// Create a singleton instance
export const cache = new Cache();

// Helper function to generate cache keys
export function generateCacheKey(
  endpoint: string,
  params?: Record<string, any>
): string {
  const queryStr = params
    ? Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join('&')
    : '';

  return `${endpoint}:${queryStr}`;
}
