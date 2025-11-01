import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { MatchCard } from '@/components/MatchCard';
import { MatchCardSkeleton } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { Match } from '@/types/cricket';
import '@/styles/globals.css';
import '@/styles/components.css';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all matches
      const res = await fetch('/api/matches?status=all');
      if (!res.ok) {
        throw new Error('Failed to fetch matches');
      }

      const allMatches: Match[] = await res.json();

      // Categorize matches
      const live = allMatches.filter((m) => m.status === 'live').slice(0, 1);
      const upcoming = allMatches
        .filter((m) => m.status === 'upcoming')
        .slice(0, 2);
      const recent = allMatches
        .filter((m) => m.status === 'completed')
        .slice(0, 2);

      setLiveMatches(live);
      setUpcomingMatches(upcoming);
      setRecentMatches(recent);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Cricket data unavailable. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CricCode - Live Cricket Scores & Schedules</title>
        <meta
          name="description"
          content="Get live cricket scores, match schedules, and results"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchMatches}
              showRetry={true}
            />
          )}

          {loading ? (
            <>
              <h2 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                Recent Matches
              </h2>
              <MatchCardSkeleton count={2} />
            </>
          ) : (
            <>
              {recentMatches.length > 0 && (
                <>
                  <h2 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                    Recent Matches
                  </h2>
                  {recentMatches.map((match) => (
                    <MatchCard key={match.matchId} match={match} />
                  ))}
                </>
              )}

              {liveMatches.length > 0 && (
                <>
                  <h2
                    style={{ marginBottom: '1rem', marginTop: '2rem', color: '#ff4444' }}
                  >
                    🔴 Live Matches
                  </h2>
                  {liveMatches.map((match) => (
                    <MatchCard key={match.matchId} match={match} />
                  ))}
                </>
              )}

              {upcomingMatches.length > 0 && (
                <>
                  <h2 style={{ marginBottom: '1rem', marginTop: '2rem', color: '#e8ecf1' }}>
                    Upcoming Matches
                  </h2>
                  {upcomingMatches.map((match) => (
                    <MatchCard key={match.matchId} match={match} />
                  ))}
                </>
              )}

              {recentMatches.length === 0 &&
                liveMatches.length === 0 &&
                upcomingMatches.length === 0 && (
                  <EmptyState
                    title="No Matches Found"
                    message="There are currently no cricket matches scheduled."
                    icon="🏏"
                  />
                )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
