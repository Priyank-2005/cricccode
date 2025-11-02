import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '@/src/components/Navbar';
import MatchCard from '@/src/components/MatchCard';

export default function HomePage() {
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch completed matches (recent)
      const completedRes = await fetch(
        '/api/matches?status=completed&limit=3'
      );
      const completedData = await completedRes.json();

      // Fetch upcoming matches
      const upcomingRes = await fetch(
        '/api/matches?status=upcoming&limit=3'
      );
      const upcomingData = await upcomingRes.json();

      if (completedData.success) {
        setRecentMatches(completedData.data);
      }

      if (upcomingData.success) {
        setUpcomingMatches(upcomingData.data);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CricCode - Cricket Scores & Updates</title>
        <meta name="description" content="Get live cricket scores, schedules, and results" />
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
          {/* Hero Section */}
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '2.5rem',
                color: '#4da6ff',
                marginBottom: '0.5rem',
              }}
            >
              Welcome to CricCode
            </h1>
            <p style={{ color: '#a0aab8', fontSize: '1.1rem' }}>
              Your source for cricket scores and schedules
            </p>
          </div>

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
                Loading matches...
              </p>
            </div>
          ) : (
            <>
              {/* Recent Matches Section */}
              {recentMatches.length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                  <h2
                    style={{
                      color: '#e8ecf1',
                      fontSize: '1.5rem',
                      marginBottom: '1.5rem',
                      borderBottom: '2px solid #4da6ff',
                      paddingBottom: '0.5rem',
                    }}
                  >
                    Recent Results
                  </h2>
                  <div>
                    {recentMatches.map((match) => (
                      <MatchCard key={match.matchId} match={match} />
                    ))}
                  </div>
                </section>
              )}

              {/* Upcoming Matches Section */}
              {upcomingMatches.length > 0 && (
                <section style={{ marginBottom: '3rem' }}>
                  <h2
                    style={{
                      color: '#e8ecf1',
                      fontSize: '1.5rem',
                      marginBottom: '1.5rem',
                      borderBottom: '2px solid #4da6ff',
                      paddingBottom: '0.5rem',
                    }}
                  >
                    Upcoming Matches
                  </h2>
                  <div>
                    {upcomingMatches.map((match) => (
                      <MatchCard key={match.matchId} match={match} />
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State */}
              {recentMatches.length === 0 && upcomingMatches.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: '#a0aab8',
                  }}
                >
                  <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                    No matches found
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7684' }}>
                    Data is being imported. Please check back soon.
                  </p>
                </div>
              )}

              {/* Browse All Link */}
              {(recentMatches.length > 0 || upcomingMatches.length > 0) && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <a
                    href="/schedules"
                    style={{
                      color: '#4da6ff',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textDecoration: 'underline',
                    }}
                  >
                    View all schedules →
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
