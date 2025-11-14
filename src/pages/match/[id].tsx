import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';

export default function MatchDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchMatch();
    }
  }, [id]);

  const fetchMatch = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/match/${id}`);
      const data = await res.json();

      if (data.success) {
        setMatch(data.data);
      } else {
        setError('Match not found');
      }
    } catch (err) {
      console.error('Error fetching match:', err);
      setError('Failed to load match details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Match - CricCode</title>
        </Head>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: '#0f1419' }}>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#a0aab8', fontSize: '1.1rem' }}>
              Loading match details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !match) {
    return (
      <>
        <Head>
          <title>Error - CricCode</title>
        </Head>
        <Navbar />
        <div style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: '#0f1419' }}>
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
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
            <Link
              href="/"
              style={{
                color: '#4da6ff',
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          {match.team1.name} vs {match.team2.name} - CricCode
        </title>
        <meta name="description" content={`Match details: ${match.team1.name} vs ${match.team2.name}`} />
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
          {/* Match Header */}
          <div
            style={{
              backgroundColor: '#1a1f26',
              border: '1px solid #2d3339',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#a0aab8', marginBottom: '0.5rem' }}>
                {match.series}
              </p>
              <h1
                style={{
                  color: '#e8ecf1',
                  fontSize: '2rem',
                  marginBottom: '0.5rem',
                }}
              >
                {match.team1.name} vs {match.team2.name}
              </h1>
              <p style={{ color: '#a0aab8', marginBottom: '1rem' }}>
                {formatDate(match.date)}
              </p>
              <p style={{ color: '#a0aab8' }}>
                {match.format} • {match.venue}
              </p>
            </div>

            {/* Score Display */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #2d3339',
                paddingBottom: '1.5rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#a0aab8', marginBottom: '0.5rem' }}>
                  {match.team1.name}
                </p>
                {match.innings1 ? (
                  <p style={{ color: '#4da6ff', fontSize: '2rem', fontWeight: 'bold' }}>
                    {match.innings1.runs}/{match.innings1.wickets}
                  </p>
                ) : (
                  <p style={{ color: '#a0aab8' }}>—</p>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#a0aab8', marginBottom: '0.5rem' }}>
                  {match.team2.name}
                </p>
                {match.innings2 ? (
                  <p style={{ color: '#4da6ff', fontSize: '2rem', fontWeight: 'bold' }}>
                    {match.innings2.runs}/{match.innings2.wickets}
                  </p>
                ) : (
                  <p style={{ color: '#a0aab8' }}>—</p>
                )}
              </div>
            </div>

            {/* Match Status/Result */}
            <div style={{ textAlign: 'center' }}>
              {match.status === 'completed' && match.result ? (
                <p
                  style={{
                    color: '#4caf50',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  }}
                >
                  {match.result}
                </p>
              ) : match.status === 'upcoming' ? (
                <p style={{ color: '#4da6ff', fontSize: '1.1rem' }}>
                  Match scheduled to begin soon
                </p>
              ) : (
                <p style={{ color: '#ff4444', fontSize: '1.1rem' }}>
                  Match is live
                </p>
              )}
            </div>
          </div>

          {/* Scorecard Section */}
          {(match.innings1 || match.innings2) && (
            <div style={{ marginBottom: '2rem' }}>
              <h2
                style={{
                  color: '#e8ecf1',
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                  borderBottom: '2px solid #4da6ff',
                  paddingBottom: '0.5rem',
                }}
              >
                Scorecard
              </h2>

              {/* Innings 1 */}
              {match.innings1 && (
                <div
                  style={{
                    backgroundColor: '#1a1f26',
                    border: '1px solid #2d3339',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <h3
                    style={{
                      color: '#4da6ff',
                      marginBottom: '1rem',
                      fontSize: '1.1rem',
                    }}
                  >
                    {match.team1.name} Innings
                  </h3>

                  {/* Summary */}
                  <div style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                    <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                      {match.innings1.runs}/{match.innings1.wickets}{' '}
                      <span style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
                        ({match.innings1.overs} overs)
                      </span>
                    </p>
                  </div>

                  {/* Batsmen */}
                  {match.innings1.batsmen && match.innings1.batsmen.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p
                        style={{
                          color: '#a0aab8',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Batsmen
                      </p>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.9rem',
                        }}
                      >
                        <thead>
                          <tr style={{ borderBottom: '1px solid #2d3339' }}>
                            <th
                              style={{
                                textAlign: 'left',
                                padding: '0.5rem 0',
                                color: '#a0aab8',
                              }}
                            >
                              Batsman
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Runs
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Balls
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              4s
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              6s
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.innings1.batsmen.map(
                            (batsman: any, idx: number) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom: '1px solid #2d3339',
                                  color: '#e8ecf1',
                                }}
                              >
                                <td style={{ padding: '0.5rem 0' }}>
                                  {batsman.name}
                                  {batsman.isOut && (
                                    <span style={{ color: '#a0aab8', fontSize: '0.85rem' }}>
                                      {' '}
                                      (out)
                                    </span>
                                  )}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.runs}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.balls}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.fours || 0}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.sixes || 0}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Bowlers */}
                  {match.innings1.bowlers && match.innings1.bowlers.length > 0 && (
                    <div>
                      <p
                        style={{
                          color: '#a0aab8',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Bowlers
                      </p>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.9rem',
                        }}
                      >
                        <thead>
                          <tr style={{ borderBottom: '1px solid #2d3339' }}>
                            <th
                              style={{
                                textAlign: 'left',
                                padding: '0.5rem 0',
                                color: '#a0aab8',
                              }}
                            >
                              Bowler
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Overs
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Runs
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Wickets
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.innings1.bowlers.map(
                            (bowler: any, idx: number) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom: '1px solid #2d3339',
                                  color: '#e8ecf1',
                                }}
                              >
                                <td style={{ padding: '0.5rem 0' }}>
                                  {bowler.name}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {bowler.overs}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {bowler.runs}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {bowler.wickets}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Innings 2 */}
              {match.innings2 && (
                <div
                  style={{
                    backgroundColor: '#1a1f26',
                    border: '1px solid #2d3339',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}
                >
                  <h3
                    style={{
                      color: '#4da6ff',
                      marginBottom: '1rem',
                      fontSize: '1.1rem',
                    }}
                  >
                    {match.team2.name} Innings
                  </h3>

                  {/* Summary */}
                  <div style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                    <p style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                      {match.innings2.runs}/{match.innings2.wickets}{' '}
                      <span style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
                        ({match.innings2.overs} overs)
                      </span>
                    </p>
                  </div>

                  {/* Batsmen */}
                  {match.innings2.batsmen && match.innings2.batsmen.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p
                        style={{
                          color: '#a0aab8',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Batsmen
                      </p>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.9rem',
                        }}
                      >
                        <thead>
                          <tr style={{ borderBottom: '1px solid #2d3339' }}>
                            <th
                              style={{
                                textAlign: 'left',
                                padding: '0.5rem 0',
                                color: '#a0aab8',
                              }}
                            >
                              Batsman
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Runs
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Balls
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              4s
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              6s
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.innings2.batsmen.map(
                            (batsman: any, idx: number) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom: '1px solid #2d3339',
                                  color: '#e8ecf1',
                                }}
                              >
                                <td style={{ padding: '0.5rem 0' }}>
                                  {batsman.name}
                                  {batsman.isOut && (
                                    <span style={{ color: '#a0aab8', fontSize: '0.85rem' }}>
                                      {' '}
                                      (out)
                                    </span>
                                  )}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.runs}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.balls}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.fours || 0}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {batsman.sixes || 0}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Bowlers */}
                  {match.innings2.bowlers && match.innings2.bowlers.length > 0 && (
                    <div>
                      <p
                        style={{
                          color: '#a0aab8',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Bowlers
                      </p>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          fontSize: '0.9rem',
                        }}
                      >
                        <thead>
                          <tr style={{ borderBottom: '1px solid #2d3339' }}>
                            <th
                              style={{
                                textAlign: 'left',
                                padding: '0.5rem 0',
                                color: '#a0aab8',
                              }}
                            >
                              Bowler
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Overs
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Runs
                            </th>
                            <th
                              style={{
                                textAlign: 'right',
                                padding: '0.5rem',
                                color: '#a0aab8',
                              }}
                            >
                              Wickets
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.innings2.bowlers.map(
                            (bowler: any, idx: number) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom: '1px solid #2d3339',
                                  color: '#e8ecf1',
                                }}
                              >
                                <td style={{ padding: '0.5rem 0' }}>
                                  {bowler.name}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {bowler.overs}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {bowler.runs}
                                </td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                  {bowler.wickets}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
