import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { MatchCard } from '@/components/MatchCard';
import { SkeletonText } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { TeamDetail, Match } from '@/types/cricket';
import '@/styles/globals.css';
import '@/styles/components.css';

export default function TeamDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/team/${id}`);

      if (res.status === 404) {
        setError('Team not found');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch team details');
      }

      const data: TeamDetail = await res.json();
      setTeam(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch team details'
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
          {team?.name || 'Team'} - CricCode
        </title>
        <meta name="description" content={`${team?.name} cricket team details`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <Link href="/teams">
            <a style={{ color: '#4da6ff', marginBottom: '1rem', display: 'inline-block' }}>
              ← Back to Teams
            </a>
          </Link>

          {error && !team && (
            <ErrorMessage
              message={error}
              onRetry={fetchTeamDetails}
              showRetry={true}
            />
          )}

          {loading ? (
            <div>
              <SkeletonText count={1} lines={3} />
            </div>
          ) : team ? (
            <>
              <div
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: '#1a1f26',
                  borderRadius: '8px',
                  border: '1px solid #2d3339',
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'start',
                }}
              >
                {team.flag_url && (
                  <img
                    src={team.flag_url}
                    alt={team.name}
                    style={{
                      width: '120px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h1 style={{ marginBottom: '0.5rem', color: '#e8ecf1' }}>
                    {team.name}
                  </h1>

                  {team.shortName && (
                    <p style={{ color: '#a0aab8', marginBottom: '1rem' }}>
                      {team.shortName}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {team.testPlaying && (
                      <div className="format-badge">Test</div>
                    )}
                    {team.odiPlaying && (
                      <div className="format-badge">ODI</div>
                    )}
                    {team.t20Playing && (
                      <div className="format-badge">T20</div>
                    )}
                  </div>
                </div>
              </div>

              {team.upcomingMatches && team.upcomingMatches.length > 0 && (
                <>
                  <h2 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                    Upcoming Matches
                  </h2>

                  {team.upcomingMatches.map((match) => (
                    <div
                      key={match.matchId}
                      style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        backgroundColor: '#1a1f26',
                        borderRadius: '8px',
                        border: '1px solid #2d3339',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 'bold',
                              color: '#e8ecf1',
                              marginBottom: '0.25rem',
                            }}
                          >
                            vs {match.opponent}
                          </div>
                          <div style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
                            {match.venue}
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: 'right',
                            color: '#a0aab8',
                            fontSize: '0.9rem',
                          }}
                        >
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {team.recentMatches && team.recentMatches.length > 0 && (
                <>
                  <h2
                    style={{
                      marginBottom: '1rem',
                      marginTop: '2rem',
                      color: '#e8ecf1',
                    }}
                  >
                    Recent Matches
                  </h2>

                  {team.recentMatches.map((match) => (
                    <div
                      key={match.matchId}
                      style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        backgroundColor: '#1a1f26',
                        borderRadius: '8px',
                        border: '1px solid #2d3339',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 'bold',
                              color: '#e8ecf1',
                              marginBottom: '0.25rem',
                            }}
                          >
                            vs {match.opponent}
                          </div>
                          <div style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
                            {match.result}
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: 'right',
                            color: '#a0aab8',
                            fontSize: '0.9rem',
                          }}
                        >
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {team.squad && team.squad.length > 0 && (
                <>
                  <h2
                    style={{
                      marginBottom: '1rem',
                      marginTop: '2rem',
                      color: '#e8ecf1',
                    }}
                  >
                    Squad
                  </h2>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    {team.squad.map((player, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#1a1f26',
                          borderRadius: '8px',
                          border: '1px solid #2d3339',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 'bold',
                            color: '#e8ecf1',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {player.name}
                        </div>
                        <div style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
                          {player.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptyState
              title="Team Not Found"
              message="The team you're looking for doesn't exist."
              icon="🏏"
            />
          )}
        </div>
      </main>
    </>
  );
}
