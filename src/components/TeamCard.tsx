import React from 'react';
import Link from 'next/link';
import { TeamInfo } from '@/types/cricket';

interface TeamCardProps {
  team: TeamInfo;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const formats = [];
  if (team.testPlaying) formats.push('Test');
  if (team.odiPlaying) formats.push('ODI');
  if (team.t20Playing) formats.push('T20');

  return (
    <Link href={`/team/${team.teamId}`}>
      <div className="team-card" style={{ display: 'block', cursor: 'pointer' }}>
          <div className="team-flag">
            {team.flag_url ? (
              <img
                src={team.flag_url}
                alt={team.name}
                style={{ width: '80px', height: '50px', borderRadius: '4px' }}
              />
            ) : (
              '🏏'
            )}
          </div>

          <div className="team-name">{team.name}</div>

          {formats.length > 0 && (
            <div className="team-formats">
              {formats.map((fmt) => (
                <div key={fmt} className="format-badge">
                  {fmt}
                </div>
              ))}
            </div>
          )}
        </div>
      </a>
    </Link>
  );
};
