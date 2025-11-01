import React from 'react';
import Link from 'next/link';
import { Series } from '@/types/cricket';
import { formatDate } from '@/lib/utils';

interface SeriesCardProps {
  series: Series;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({ series }) => {
  const getStatusBadgeColor = (
    status: 'ongoing' | 'upcoming' | 'completed'
  ): 'live' | 'upcoming' | 'completed' => {
    if (status === 'ongoing') return 'live';
    if (status === 'upcoming') return 'upcoming';
    return 'completed';
  };

  const statusColor = getStatusBadgeColor(series.status);

  return (
    <Link href={`/tournament/${series.seriesId}`}>
      <div className="series-card" style={{ display: 'block', cursor: 'pointer' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '1rem',
            }}
          >
            <div className="series-name">{series.name}</div>
            <span className={`match-status-badge ${statusColor}`}>
              {series.status.toUpperCase()}
            </span>
          </div>

          <div className="series-meta">
            <div>
              <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>Format</div>
              <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                {series.format}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>Teams</div>
              <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                {series.participatingTeams}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>Start</div>
              <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                {formatDate(series.startDate)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', color: '#a0aab8' }}>End</div>
              <div style={{ fontWeight: 'bold', color: '#e8ecf1' }}>
                {formatDate(series.endDate)}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};
