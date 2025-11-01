import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Navbar } from '@/components/Navbar';
import { TeamCard } from '@/components/TeamCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { TeamInfo } from '@/types/cricket';
import '@/styles/globals.css';
import '@/styles/components.css';

export default function Teams() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTeams, setAllTeams] = useState<TeamInfo[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamInfo[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'test' | 'odi' | 't20'>(
    'all'
  );

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [allTeams, typeFilter]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/teams');
      if (!res.ok) {
        throw new Error('Failed to fetch teams');
      }

      const data: TeamInfo[] = await res.json();
      setAllTeams(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch teams'
      );
    } finally {
      setLoading(false);
    }
  };

  const filterTeams = () => {
    let filtered = allTeams;

    if (typeFilter === 'test') {
      filtered = filtered.filter((t) => t.testPlaying);
    } else if (typeFilter === 'odi') {
      filtered = filtered.filter((t) => t.odiPlaying);
    } else if (typeFilter === 't20') {
      filtered = filtered.filter((t) => t.t20Playing);
    }

    setFilteredTeams(filtered);
  };

  return (
    <>
      <Head>
        <title>Cricket Teams - CricCode</title>
        <meta name="description" content="Browse international cricket teams" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: '2rem', color: '#e8ecf1' }}>
            Cricket Teams
          </h1>

          <div className="filter-bar">
            <div className="filter-group">
              <label className="filter-label">Filter by Format:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="filter-select"
              >
                <option value="all">All Teams</option>
                <option value="test">Test Playing</option>
                <option value="odi">ODI Playing</option>
                <option value="t20">T20 Playing</option>
              </select>
            </div>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchTeams}
              showRetry={true}
            />
          )}

          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem',
              }}
            >
              <SkeletonLoader count={8} height="200px" />
            </div>
          ) : filteredTeams.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem',
              }}
            >
              {filteredTeams.map((team) => (
                <TeamCard key={team.teamId} team={team} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Teams Found"
              message="No teams found for the selected format."
              icon="🏏"
            />
          )}
        </div>
      </main>
    </>
  );
}
