import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { SkeletonText } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { MatchDetail, Batsman, Bowler } from '@/types/cricket';
import { formatDateTime, formatResultText } from '@/lib/utils';
import '@/styles/globals.css';
import '@/styles/components.css';

export default function MatchDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchMatchDetails();
  }, [id]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/match/${id}`);

      if (res.status === 404) {
        setError('Match not found');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch match details');
      }

      const data: MatchDetail = await res.json();
      setMatch(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch match details'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!id) return null;

  const StatsTable = ({
    title,
    data,
    type,
  }: {
    title: string;
    data: (Batsman | Bowler)[] | undefined;
    type: 'batsmen' | 'bowlers';
  }) => {
    if (!data || data.length === 0) return null;

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>{title}</h4>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#1a1f26',
              borderRadius: '8px',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3339' }}>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    color: '#a0aab8',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  Name
                </th>
                {type === 'batsmen' && (
                  <>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Runs
                    </th>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Balls
                    </th>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Status
                    </th>
                  </>
                )}
                {type === 'bowlers' && (
                  <>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Overs
                    </th>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Runs
                    </th>
                    <th
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        color: '#a0aab8',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      Wickets
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid #2d3339',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : '#252c35',
                  }}
                >
                  <td
                    style={{
                      padding: '0.75rem',
                      color: '#e8ecf1',
                      fontWeight: '500',
                    }}
                  >
                    {item.name}
                  </td>
                  {type === 'batsmen' && (
                    <>
                      <td
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          color: '#4da6ff',
                          fontWeight: 'bold',
                        }}
                      >
                        {(item as Batsman).runs}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          color: '#a0aab8',
                        }}
                      >
                        {(item as Batsman).balls}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          color: (item as Batsman).isOut ? '#ff4444' : '#4caf50',
                        }}
                      >
                        {(item as Batsman).isOut ? 'Out' : 'Not Out'}
                      </td>
                    </>
                  )}
                  {type === 'bowlers' && (
                    <>
                      <td
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          color: '#a0aab8',
                        }}
                      >
                        {(item as Bowler).overs}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          color: '#a0aab8',
                        }}
                      >
                        {(item as Bowler).runs}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          color: '#ff6b6b',
                          fontWeight: 'bold',
                        }}
                      >
                        {(item as Bowler).wickets}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Match Details - CricCode</title>
        <meta name="description" content="Cricket match details and scorecard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <Link href="/">
            <a style={{ color: '#4da6ff', marginBottom: '1rem', display: 'inline-block' }}>
              ← Back to Home
            </a>
          </Link>

          {error && !match && (
            <ErrorMessage
              message={error}
              onRetry={fetchMatchDetails}
              showRetry={true}
            />
          )}

          {loading ? (
            <div>
              <SkeletonText count={1} lines={4} />
            </div>
          ) : match ? (
            <>
              {/* Match Header */}
              <div
                style={{
                  marginBottom: '2rem',
                  padding: '2rem',
                  backgroundColor: '#1a1f26',
                  borderRadius: '8px',
                  border: '1px solid #2d3339',
                }}
              >
                <h1
                  style={{
                    marginBottom: '1rem',
                    color: '#e8ecf1',
                    fontSize: '1.8rem',
                  }}
                >
                  {match.team1.name} vs {match.team2.name}
                </h1>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>
                      Format
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {match.format}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>
                      Series
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {match.series.name}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>
                      Venue
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {match.venue}
                      {match.city && `, ${match.city}`}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>
                      Date
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                      {formatDateTime(match.date)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>
                      Status
                    </div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color:
                          match.status === 'live'
                            ? '#ff4444'
                            : match.status === 'upcoming'
                            ? '#4da6ff'
                            : '#4caf50',
                      }}
                    >
                      {match.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                {match.result && (
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: '#252c35',
                      borderRadius: '4px',
                      color: '#ffa500',
                      fontWeight: 'bold',
                    }}
                  >
                    {formatResultText(
                      match.team1.name,
                      match.team2.name,
                      match.result
                    )}
                  </div>
                )}
              </div>

              {/* Scorecard */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#e8ecf1' }}>
                  Scorecard
                </h2>

                {/* Team 1 */}
                <div
                  style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
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
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #2d3339',
                    }}
                  >
                    <h3 style={{ color: '#e8ecf1' }}>{match.team1.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4da6ff' }}>
                        {match.team1.innings?.runs || match.team1.score || '—'}
                      </div>
                      <div style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
                        {match.team1.innings?.wickets || match.team1.wickets || '0'} /{' '}
                        {match.team1.innings?.overs || match.team1.overs || '—'}
                      </div>
                    </div>
                  </div>

                  <StatsTable
                    title="Batsmen"
                    data={match.team1.innings?.batsmen}
                    type="batsmen"
                  />
                  <StatsTable
                    title="Bowlers"
                    data={match.team1.innings?.bowlers}
                    type="bowlers"
                  />
                </div>

                {/* Team 2 */}
                <div
                  style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
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
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #2d3339',
                    }}
                  >
                    <h3 style={{ color: '#e8ecf1' }}>{match.team2.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4da6ff' }}>
                        {match.team2.innings?.runs || match.team2.score || '—'}
                      </div>
                      <div style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
                        {match.team2.innings?.wickets || match.team2.wickets || '0'} /{' '}
                        {match.team2.innings?.overs || match.team2.overs || '—'}
                      </div>
                    </div>
                  </div>

                  <StatsTable
                    title="Batsmen"
                    data={match.team2.innings?.batsmen}
                    type="batsmen"
                  />
                  <StatsTable
                    title="Bowlers"
                    data={match.team2.innings?.bowlers}
                    type="bowlers"
                  />
                </div>
              </div>

              {/* Match Info */}
              {(match.manOfTheMatch || match.toss) && (
                <div
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#1a1f26',
                    borderRadius: '8px',
                    border: '1px solid #2d3339',
                  }}
                >
                  <h3 style={{ marginBottom: '1rem', color: '#e8ecf1' }}>
                    Match Info
                  </h3>

                  {match.toss && (
                    <div style={{ marginBottom: '0.75rem', color: '#a0aab8' }}>
                      <span style={{ fontWeight: 'bold' }}>Toss:</span>{' '}
                      {match.toss}
                    </div>
                  )}

                  {match.manOfTheMatch && (
                    <div style={{ color: '#a0aab8' }}>
                      <span style={{ fontWeight: 'bold' }}>Man of the Match:</span>{' '}
                      {match.manOfTheMatch}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Match Not Found"
              message="The match you're looking for doesn't exist."
              icon="🏏"
            />
          )}
        </div>
      </main>
    </>
  );
}
