import React from 'react';
import Link from 'next/link';

interface MatchCardProps {
  match: any; // Using any to avoid type issues with Mongoose documents
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#ff4444';
      case 'upcoming':
        return '#4da6ff';
      case 'completed':
        return '#4caf50';
      default:
        return '#a0aab8';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toUpperCase();
  };

  const formatDate = (date: string | Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreDisplay = () => {
    if (match.status === 'upcoming') {
      return { team1Score: '—', team2Score: '—' };
    }

    if (match.status === 'completed' || match.status === 'live') {
      const team1Score = match.innings1?.runs || '—';
      const team2Score = match.innings2?.runs || '—';
      return { team1Score, team2Score };
    }

    return { team1Score: '—', team2Score: '—' };
  };

  const { team1Score, team2Score } = getScoreDisplay();

  return (
    <Link href={`/match/${match.matchId}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#1a1f26',
          border: '1px solid #2d3339',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#252c35';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#1a1f26';
        }}
      >
        {/* Header: Series name and status badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <span style={{ color: '#a0aab8', fontSize: '0.9rem' }}>
            {match.series}
          </span>
          <span
            style={{
              backgroundColor: getStatusBadgeColor(match.status),
              color: match.status === 'completed' ? '#000' : '#fff',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {getStatusLabel(match.status)}
          </span>
        </div>

        {/* Match scores */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            gap: '1rem',
          }}
        >
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: '#e8ecf1', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {match.team1.name}
            </div>
            <div
              style={{
                color: '#4da6ff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginTop: '0.25rem',
              }}
            >
              {team1Score}
            </div>
          </div>

          <div style={{ color: '#a0aab8', fontSize: '1rem' }}>vs</div>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: '#e8ecf1', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {match.team2.name}
            </div>
            <div
              style={{
                color: '#4da6ff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginTop: '0.25rem',
              }}
            >
              {team2Score}
            </div>
          </div>
        </div>

        {/* Match details */}
        <div style={{ borderTop: '1px solid #2d3339', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ color: '#a0aab8', fontSize: '0.85rem' }}>Format</div>
              <div style={{ color: '#e8ecf1', fontWeight: 'bold' }}>{match.format}</div>
            </div>
            <div>
              <div style={{ color: '#a0aab8', fontSize: '0.85rem' }}>Venue</div>
              <div style={{ color: '#e8ecf1', fontWeight: 'bold' }}>{match.venue}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ color: '#a0aab8', fontSize: '0.85rem' }}>Date</div>
              <div style={{ color: '#e8ecf1', fontWeight: 'bold' }}>
                {formatDate(match.date)}
              </div>
            </div>
          </div>

          {match.result && match.status === 'completed' && (
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #2d3339',
                color: '#4caf50',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              {match.result}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
