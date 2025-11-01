import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { MatchCard } from '@/components/MatchCard';
import { SkeletonText } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { Series, Match, PointsTableEntry } from '@/types/cricket';
import { formatDate } from '@/lib/utils';

export default function TournamentDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchTournamentDetails();
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, fetch all series and find the one with matching ID
      const seriesRes = await fetch('/api/series?status=all');
      if (!seriesRes.ok) {
        throw new Error('Failed to fetch tournament details');
      }

      const allSeries: Series[] = await seriesRes.json();
      const foundSeries = allSeries.find((s) => s.seriesId === id);

      if (!foundSeries) {
        setError('Tournament not found');
        return;
      }

      setSeries(foundSeries);

      // Fetch matches for this series - would need series filtering in API
      // For now, fetch all matches
      const matchesRes = await fetch('/api/matches?status=all');
      if (matchesRes.ok) {
        const allMatches: Match[] = await matchesRes.json();
        // Filter to series in real implementation
        setMatches(allMatches);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch tournament details'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!id) return null;

  return (
    <>
      <Head>
        <title>
          {series?.name || 'Tournament'} - CricCode
        </title>
        <meta name="description" content={`${series?.name} cricket tournament details`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <Link href="/tournaments" style={{ color: '#4da6ff', marginBottom: '1rem', display: 'inline-block' }}>
            ← Back to Tournaments
          </Link>

          {error && !series && (
            <ErrorMessage
              message={error}
              onRetry={fetchTournamentDetails}
              showRetry={true}
            />
          )}

          {loading ? (
            <div>
              <SkeletonText count={1} lines={3} />
            </div>
          ) : series ? (
            <>
              <div
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: '#1a1f26',
                  borderRadius: '8px',
                  border: '1px solid #2d3339',
                }}
              >
                <h1 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                  {series.name}
                </h1>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#a0aab8' }}>
                      Status
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {series.status.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#a0aab8' }}>
                      Format
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {series.format}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#a0aab8' }}>
                      Teams
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {series.participatingTeams}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#a0aab8' }}>
                      Start Date
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {formatDate(series.startDate)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#a0aab8' }}>
                      End Date
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {formatDate(series.endDate)}
                    </div>
                  </div>
                </div>
              </div>

              {series.pointsTable && series.pointsTable.length > 0 && (
                <>
                  <h2 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                    Points Table
                  </h2>

                  <div
                    style={{
                      overflowX: 'auto',
                      marginBottom: '2rem',
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#1a1f26',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: '1px solid #2d3339' }}>
                          <th
                            style={{
                              padding: '1rem',
                              textAlign: 'left',
                              color: '#a0aab8',
                              fontWeight: 'bold',
                            }}
                          >
                            Pos
                          </th>
                          <th
                            style={{
                              padding: '1rem',
                              textAlign: 'left',
                              color: '#a0aab8',
                              fontWeight: 'bold',
                            }}
                          >
                            Team
                          </th>
                          <th
                            style={{
                              padding: '1rem',
                              textAlign: 'center',
                              color: '#a0aab8',
                              fontWeight: 'bold',
                            }}
                          >
                            Played
                          </th>
                          <th
                            style={{
                              padding: '1rem',
                              textAlign: 'center',
                              color: '#a0aab8',
                              fontWeight: 'bold',
                            }}
                          >
                            Won
                          </th>
                          <th
                            style={{
                              padding: '1rem',
                              textAlign: 'center',
                              color: '#a0aab8',
                              fontWeight: 'bold',
                            }}
                          >
                            Lost
                          </th>
                          <th
                            style={{
                              padding: '1rem',
                              textAlign: 'center',
                              color: '#a0aab8',
                              fontWeight: 'bold',
                            }}
                          >
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {series.pointsTable.map((entry, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid #2d3339',
                              backgroundColor: idx % 2 === 0 ? 'transparent' : '#252c35',
                            }}
                          >
                            <td
                              style={{
                                padding: '1rem',
                                color: '#e8ecf1',
                              }}
                            >
                              {entry.position}
                            </td>
                            <td
                              style={{
                                padding: '1rem',
                                color: '#e8ecf1',
                                fontWeight: 'bold',
                              }}
                            >
                              {entry.team}
                            </td>
                            <td
                              style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#a0aab8',
                              }}
                            >
                              {entry.played}
                            </td>
                            <td
                              style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#4caf50',
                              }}
                            >
                              {entry.won}
                            </td>
                            <td
                              style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#ff4444',
                              }}
                            >
                              {entry.lost}
                            </td>
                            <td
                              style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#ffa500',
                                fontWeight: 'bold',
                              }}
                            >
                              {entry.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {matches.length > 0 && (
                <>
                  <h2 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                    Matches
                  </h2>

                  {matches.map((match) => (
                    <MatchCard key={match.matchId} match={match} />
                  ))}
                </>
              )}
            </>
          ) : (
            <EmptyState
              title="Tournament Not Found"
              message="The tournament you're looking for doesn't exist."
              icon="🏏"
            />
          )}
        </div>
      </main>
    </>
  );
}
