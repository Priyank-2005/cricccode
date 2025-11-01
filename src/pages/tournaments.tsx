import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { SeriesCard } from '@/components/SeriesCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { Series } from '@/types/cricket';
import '@/styles/globals.css';
import '@/styles/components.css';

export default function Tournaments() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ongoingSeries, setOngoingSeries] = useState<Series[]>([]);
  const [upcomingSeries, setUpcomingSeries] = useState<Series[]>([]);
  const [completedSeries, setCompletedSeries] = useState<Series[]>([]);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/series?status=all');
      if (!res.ok) {
        throw new Error('Failed to fetch series');
      }

      const allSeries: Series[] = await res.json();

      // Categorize series
      const ongoing = allSeries.filter((s) => s.status === 'ongoing');
      const upcoming = allSeries.filter((s) => s.status === 'upcoming');
      const completed = allSeries.filter((s) => s.status === 'completed');

      setOngoingSeries(ongoing);
      setUpcomingSeries(upcoming);
      setCompletedSeries(completed);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch tournaments'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cricket Tournaments - CricCode</title>
        <meta name="description" content="Browse cricket tournaments and series" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: '2rem', color: '#e8ecf1' }}>
            Cricket Tournaments
          </h1>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchSeries}
              showRetry={true}
            />
          )}

          {loading ? (
            <>
              <h2 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                Ongoing
              </h2>
              <SkeletonLoader count={2} />
            </>
          ) : (
            <>
              {ongoingSeries.length > 0 && (
                <>
                  <h2
                    style={{
                      marginBottom: '1rem',
                      color: '#ff4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    🔴 Ongoing Tournaments
                  </h2>
                  {ongoingSeries.map((series) => (
                    <SeriesCard key={series.seriesId} series={series} />
                  ))}
                </>
              )}

              {upcomingSeries.length > 0 && (
                <>
                  <h2 style={{ marginBottom: '1rem', marginTop: '2rem', color: '#e8ecf1' }}>
                    Upcoming Tournaments
                  </h2>
                  {upcomingSeries.map((series) => (
                    <SeriesCard key={series.seriesId} series={series} />
                  ))}
                </>
              )}

              {completedSeries.length > 0 && (
                <>
                  <h2 style={{ marginBottom: '1rem', marginTop: '2rem', color: '#e8ecf1' }}>
                    Recently Completed
                  </h2>
                  {completedSeries.map((series) => (
                    <SeriesCard key={series.seriesId} series={series} />
                  ))}
                </>
              )}

              {ongoingSeries.length === 0 &&
                upcomingSeries.length === 0 &&
                completedSeries.length === 0 && (
                  <EmptyState
                    title="No Tournaments Found"
                    message="There are currently no cricket tournaments available."
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
