import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { SkeletonText } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { Rankings, RankingEntry } from '@/types/cricket';

export default function RankingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Team rankings
  const [teamRankingsTest, setTeamRankingsTest] = useState<RankingEntry[]>([]);
  const [teamRankingsODI, setTeamRankingsODI] = useState<RankingEntry[]>([]);
  const [teamRankingsT20, setTeamRankingsT20] = useState<RankingEntry[]>([]);

  // Player rankings
  const [playerRankingsBattingTest, setPlayerRankingsBattingTest] = useState<
    RankingEntry[]
  >([]);
  const [playerRankingsBowlingTest, setPlayerRankingsBowlingTest] = useState<
    RankingEntry[]
  >([]);

  // Tab states
  const [rankingsType, setRankingsType] = useState<'teams' | 'players'>(
    'teams'
  );
  const [teamFormat, setTeamFormat] = useState<'test' | 'odi' | 't20'>(
    'test'
  );
  const [playerCategory, setPlayerCategory] = useState<
    'batting' | 'bowling' | 'allrounder'
  >('batting');
  const [playerFormat, setPlayerFormat] = useState<'test' | 'odi' | 't20'>(
    'test'
  );

  useEffect(() => {
    fetchRankings();
  }, [rankingsType, teamFormat, playerCategory, playerFormat]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (rankingsType === 'teams') {
        const params = new URLSearchParams();
        params.append('type', 'teams');
        params.append('format', teamFormat);

        const res = await fetch(`/api/rankings?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to fetch team rankings');
        }

        const data: Rankings = await res.json();

        if (teamFormat === 'test') {
          setTeamRankingsTest(data.rankings);
        } else if (teamFormat === 'odi') {
          setTeamRankingsODI(data.rankings);
        } else {
          setTeamRankingsT20(data.rankings);
        }
      } else {
        const params = new URLSearchParams();
        params.append('type', 'players');
        params.append('category', playerCategory);
        params.append('format', playerFormat);

        const res = await fetch(`/api/rankings?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to fetch player rankings');
        }

        const data: Rankings = await res.json();

        if (playerCategory === 'batting') {
          setPlayerRankingsBattingTest(data.rankings);
        } else if (playerCategory === 'bowling') {
          setPlayerRankingsBowlingTest(data.rankings);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch rankings'
      );
    } finally {
      setLoading(false);
    }
  };

  const RankingsTable = ({ entries }: { entries: RankingEntry[] }) => (
    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
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
              Rank
            </th>
            <th
              style={{
                padding: '1rem',
                textAlign: 'left',
                color: '#a0aab8',
                fontWeight: 'bold',
              }}
            >
              Name
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
            <th
              style={{
                padding: '1rem',
                textAlign: 'center',
                color: '#a0aab8',
                fontWeight: 'bold',
              }}
            >
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
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
                  color: '#ffa500',
                  fontWeight: 'bold',
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
                {entry.name}
              </td>
              <td
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  color: '#a0aab8',
                }}
              >
                {entry.points}
              </td>
              <td
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  color: '#4da6ff',
                  fontWeight: 'bold',
                }}
              >
                {entry.rating.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Head>
        <title>Cricket Rankings - CricCode</title>
        <meta name="description" content="ICC cricket rankings" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: '2rem', color: '#e8ecf1' }}>
            Cricket Rankings
          </h1>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchRankings}
              showRetry={true}
            />
          )}

          {/* Rankings Type Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid #2d3339',
            }}
          >
            <button
              onClick={() => setRankingsType('teams')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: rankingsType === 'teams' ? '#4da6ff' : 'transparent',
                color: rankingsType === 'teams' ? '#000' : '#a0aab8',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderBottom: rankingsType === 'teams' ? '2px solid #4da6ff' : 'none',
              }}
            >
              Team Rankings
            </button>
            <button
              onClick={() => setRankingsType('players')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor:
                  rankingsType === 'players' ? '#4da6ff' : 'transparent',
                color: rankingsType === 'players' ? '#000' : '#a0aab8',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderBottom:
                  rankingsType === 'players' ? '2px solid #4da6ff' : 'none',
              }}
            >
              Player Rankings
            </button>
          </div>

          {rankingsType === 'teams' ? (
            <>
              {/* Team Format Tabs */}
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {(['test', 'odi', 't20'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTeamFormat(fmt)}
                      className="btn"
                      style={{
                        backgroundColor:
                          teamFormat === fmt ? '#4da6ff' : '#1a1f26',
                        color: teamFormat === fmt ? '#000' : '#a0aab8',
                        border: '1px solid #2d3339',
                      }}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <SkeletonText count={3} lines={2} />
                ) : (
                  <RankingsTable
                    entries={
                      teamFormat === 'test'
                        ? teamRankingsTest
                        : teamFormat === 'odi'
                        ? teamRankingsODI
                        : teamRankingsT20
                    }
                  />
                )}
              </div>
            </>
          ) : (
            <>
              {/* Player Category Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                {(
                  ['batting', 'bowling', 'allrounder'] as const
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPlayerCategory(cat)}
                    className="btn"
                    style={{
                      backgroundColor:
                        playerCategory === cat ? '#4da6ff' : '#1a1f26',
                      color: playerCategory === cat ? '#000' : '#a0aab8',
                      border: '1px solid #2d3339',
                    }}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Player Format Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                {(['test', 'odi', 't20'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setPlayerFormat(fmt)}
                    className="btn"
                    style={{
                      backgroundColor:
                        playerFormat === fmt ? '#4da6ff' : '#1a1f26',
                      color: playerFormat === fmt ? '#000' : '#a0aab8',
                      border: '1px solid #2d3339',
                    }}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>

              {loading ? (
                <SkeletonText count={3} lines={2} />
              ) : (
                <RankingsTable
                  entries={
                    playerCategory === 'batting'
                      ? playerRankingsBattingTest
                      : playerRankingsBowlingTest
                  }
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
