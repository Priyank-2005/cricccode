import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { MatchCard } from '@/components/MatchCard';
import { FilterBar } from '@/components/FilterBar';
import { MatchCardSkeleton } from '@/components/SkeletonLoader';
import { ErrorMessage, EmptyState } from '@/components/ErrorMessage';
import { Match, TeamInfo } from '@/types/cricket';
import { getUpcomingDateRange } from '@/lib/utils';
import '@/styles/globals.css';
import '@/styles/components.css';

export default function Schedules() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<TeamInfo[]>([]);

  // Filter states
  const [format, setFormat] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  // Initialize date range
  useEffect(() => {
    const { startDate: start, endDate: end } = getUpcomingDateRange(30);
    setStartDate(start);
    setEndDate(end);
  }, []);

  // Load teams
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const res = await fetch('/api/teams');
        if (res.ok) {
          const data: TeamInfo[] = await res.json();
          setTeams(data);
        }
      } catch (err) {
        console.error('Failed to load teams:', err);
      }
    };

    loadTeams();
  }, []);

  // Fetch matches whenever filters change
  useEffect(() => {
    if (startDate && endDate) {
      fetchMatches();
    }
  }, [format, startDate, endDate, selectedTeams]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('status', 'upcoming');
      if (format !== 'all') params.append('format', format);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (selectedTeams.length > 0) params.append('team', selectedTeams.join(','));

      const res = await fetch(`/api/matches?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data: Match[] = await res.json();

      // Group by date
      const grouped = data.reduce(
        (acc, match) => {
          const date = new Date(match.date).toLocaleDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(match);
          return acc;
        },
        {} as Record<string, Match[]>
      );

      // Sort and flatten
      const sorted = Object.keys(grouped)
        .sort()
        .flatMap((date) => grouped[date]);

      setMatches(sorted);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch schedules'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (fmt: string) => {
    setFormat(fmt);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleTeamChange = (teamIds: string[]) => {
    setSelectedTeams(teamIds);
  };

  const handleClearFilters = () => {
    setFormat('all');
    const { startDate: start, endDate: end } = getUpcomingDateRange(30);
    setStartDate(start);
    setEndDate(end);
    setSelectedTeams([]);
  };

  return (
    <>
      <Head>
        <title>Cricket Schedules - CricCode</title>
        <meta name="description" content="Browse upcoming cricket matches and schedules" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: '2rem', color: '#e8ecf1' }}>
            Cricket Schedules
          </h1>

          <FilterBar
            onFormatChange={handleFormatChange}
            onDateRangeChange={handleDateRangeChange}
            onTeamChange={handleTeamChange}
            onClearFilters={handleClearFilters}
            formats={['Test', 'ODI', 'T20I', 'T20']}
            teams={teams.map((t) => ({ id: t.teamId, name: t.name }))}
            initialFormat={format}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />

          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchMatches}
              showRetry={true}
            />
          )}

          {loading ? (
            <MatchCardSkeleton count={5} />
          ) : matches.length > 0 ? (
            <div>
              {matches.map((match) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Matches Found"
              message="Try adjusting your filters to see more matches."
              icon="🔍"
              actionButton={{
                label: 'Clear Filters',
                onClick: handleClearFilters,
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
