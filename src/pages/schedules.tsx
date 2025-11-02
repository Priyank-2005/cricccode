import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/src/components/Navbar';
import MatchCard from '@/src/components/MatchCard';
import FilterBar from '@/src/components/FilterBar';

export default function SchedulesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [format, setFormat] = useState(
    (router.query.format as string) || 'all'
  );
  const [startDate, setStartDate] = useState(
    (router.query.startDate as string) || ''
  );
  const [endDate, setEndDate] = useState(
    (router.query.endDate as string) || ''
  );

  useEffect(() => {
    fetchMatches();
  }, [format, startDate, endDate]);

  const fetchMatches = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        status: 'upcoming',
        limit: '100',
      });

      if (format !== 'all') {
        params.append('format', format);
      }

      if (startDate) {
        params.append('startDate', startDate);
      }

      if (endDate) {
        params.append('endDate', endDate);
      }

      const res = await fetch(`/api/matches?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setMatches(data.data);
      } else {
        setError('Failed to fetch matches');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    updateUrl({ format: newFormat });
  };

  const handleStartDateChange = (newDate: string) => {
    setStartDate(newDate);
    updateUrl({ startDate: newDate });
  };

  const handleEndDateChange = (newDate: string) => {
    setEndDate(newDate);
    updateUrl({ endDate: newDate });
  };

  const handleClearFilters = () => {
    setFormat('all');
    setStartDate('');
    setEndDate('');
    router.push('/schedules');
  };

  const updateUrl = (newParams: any) => {
    const params = new URLSearchParams();
    if (newParams.format && newParams.format !== 'all') {
      params.append('format', newParams.format);
    }
    if (newParams.startDate) {
      params.append('startDate', newParams.startDate);
    }
    if (newParams.endDate) {
      params.append('endDate', newParams.endDate);
    }

    const query = params.toString();
    router.push(`/schedules${query ? '?' + query : ''}`, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <Head>
        <title>Match Schedules - CricCode</title>
        <meta name="description" content="Upcoming cricket matches and schedules" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <div style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: '#0f1419' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
          }}
        >
          <h1
            style={{
              color: '#e8ecf1',
              fontSize: '2rem',
              marginBottom: '1.5rem',
            }}
          >
            Match Schedules
          </h1>

          <FilterBar
            onFormatChange={handleFormatChange}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onClearFilters={handleClearFilters}
            currentFormat={format}
            currentStartDate={startDate}
            currentEndDate={endDate}
          />

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid #ff4444',
                color: '#ff4444',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem',
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#a0aab8', fontSize: '1.1rem' }}>
                Loading schedules...
              </p>
            </div>
          ) : matches.length > 0 ? (
            <div>
              <p style={{ color: '#a0aab8', marginBottom: '1.5rem' }}>
                Found {matches.length} upcoming match
                {matches.length !== 1 ? 'es' : ''}
              </p>
              {matches.map((match) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: '#1a1f26',
                borderRadius: '8px',
                border: '1px solid #2d3339',
              }}
            >
              <p style={{ color: '#a0aab8', fontSize: '1.1rem' }}>
                No matches found with the current filters
              </p>
              <button
                onClick={handleClearFilters}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4da6ff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
