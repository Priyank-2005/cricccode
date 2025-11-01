import React from 'react';
import Link from 'next/link';
import { Match, MatchStatus } from '@/types/cricket';
import {
  formatDateTime,
  formatTime,
  formatResultText,
  getStatusColor,
} from '@/lib/utils';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const status = getStatusColor(match.status);
  const statusText = match.status.toUpperCase();

  const getScoreDisplay = () => {
    if (match.status === 'live' || match.status === 'completed') {
      return {
        team1Score: match.team1.score !== undefined ? `${match.team1.score}` : '—',
        team2Score: match.team2.score !== undefined ? `${match.team2.score}` : '—',
        team1Wickets:
          match.team1.wickets !== undefined ? `/${match.team1.wickets}` : '',
        team2Wickets:
          match.team2.wickets !== undefined ? `/${match.team2.wickets}` : '',
        team1Overs: match.team1.overs ? ` (${match.team1.overs})` : '',
        team2Overs: match.team2.overs ? ` (${match.team2.overs})` : '',
      };
    }
    return {
      team1Score: '—',
      team2Score: '—',
      team1Wickets: '',
      team2Wickets: '',
      team1Overs: '',
      team2Overs: '',
    };
  };

  const scores = getScoreDisplay();

  return (
    <Link href={`/match/${match.matchId}`}>
      <div className="match-card" style={{ display: 'block', cursor: 'pointer' }}>
          <div className="match-card-header">
            <div className="match-series">{match.series}</div>
            <span className={`match-status-badge ${status}`}>{statusText}</span>
          </div>

          <div className="match-teams">
            <div className="match-team">
              <div className="match-team-name">{match.team1.name}</div>
              <div className="match-team-score">
                {scores.team1Score}
                {scores.team1Wickets}
                {scores.team1Overs}
              </div>
            </div>
            <div className="match-vs">vs</div>
            <div className="match-team">
              <div className="match-team-name">{match.team2.name}</div>
              <div className="match-team-score">
                {scores.team2Score}
                {scores.team2Wickets}
                {scores.team2Overs}
              </div>
            </div>
          </div>

          <div className="match-meta">
            <div style={{ flex: 1 }}>
              <div className="match-format">
                <span>{match.format}</span>
              </div>
              <div className="match-venue" style={{ marginTop: '0.25rem' }}>
                <span>{match.venue}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {match.status === 'upcoming' && (
                <div>{formatDateTime(match.date)}</div>
              )}
              {match.status === 'live' && (
                <div style={{ color: '#ff4444' }}>Live Now</div>
              )}
              {match.status === 'completed' && match.result && (
                <div>{formatResultText(match.team1.name, match.team2.name, match.result)}</div>
              )}
            </div>
          </div>

          {match.odds && (
            <div className="match-odds">
              <div className="odds-item">
                <div className="odds-label">{match.team1.name}</div>
                <div className="odds-value">{match.odds.team1.toFixed(2)}</div>
              </div>
              <div className="odds-item">
                <div className="odds-label">{match.team2.name}</div>
                <div className="odds-value">{match.odds.team2.toFixed(2)}</div>
              </div>
              {match.odds.draw > 0 && (
                <div className="odds-item">
                  <div className="odds-label">Draw</div>
                  <div className="odds-value">{match.odds.draw.toFixed(2)}</div>
                </div>
              )}
            </div>
          )}
        </div>
    </Link>
  );
};
