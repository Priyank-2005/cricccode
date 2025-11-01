import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { MatchFormat } from '@/types/cricket';

interface FilterBarProps {
  onFormatChange: (format: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onTeamChange: (teams: string[]) => void;
  onClearFilters: () => void;
  formats?: MatchFormat[];
  teams?: Array<{ id: string; name: string }>;
  initialFormat?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFormatChange,
  onDateRangeChange,
  onTeamChange,
  onClearFilters,
  formats = ['Test', 'ODI', 'T20I', 'T20'],
  teams = [],
  initialFormat = 'all',
  initialStartDate = '',
  initialEndDate = '',
}) => {
  const [format, setFormat] = useState(initialFormat);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormat = e.target.value;
    setFormat(newFormat);
    onFormatChange(newFormat);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onDateRangeChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onDateRangeChange(startDate, newEndDate);
  };

  const handleTeamToggle = (teamId: string) => {
    let newTeams: string[];
    if (selectedTeams.includes(teamId)) {
      newTeams = selectedTeams.filter((t) => t !== teamId);
    } else {
      newTeams = [...selectedTeams, teamId];
    }
    setSelectedTeams(newTeams);
    onTeamChange(newTeams);
  };

  const handleClearFilters = () => {
    setFormat('all');
    setStartDate('');
    setEndDate('');
    setSelectedTeams([]);
    setShowTeamDropdown(false);
    onClearFilters();
  };

  const hasActiveFilters =
    format !== 'all' || startDate || endDate || selectedTeams.length > 0;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Format:</label>
        <select
          value={format}
          onChange={handleFormatChange}
          className="filter-select"
        >
          <option value="all">All Formats</option>
          {formats.map((fmt) => (
            <option key={fmt} value={fmt.toLowerCase()}>
              {fmt}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">From:</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">To:</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="filter-input"
        />
      </div>

      {teams.length > 0 && (
        <div className="filter-group" style={{ position: 'relative' }}>
          <label className="filter-label">Teams:</label>
          <button
            onClick={() => setShowTeamDropdown(!showTeamDropdown)}
            className="filter-select"
            style={{ cursor: 'pointer' }}
          >
            {selectedTeams.length > 0
              ? `${selectedTeams.length} selected`
              : 'Select teams'}
          </button>
          {showTeamDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#1a1f26',
                border: '1px solid #2d3339',
                borderRadius: '4px',
                zIndex: 10,
                marginTop: '0.5rem',
                minWidth: '200px',
              }}
            >
              {teams.map((team) => (
                <label
                  key={team.id}
                  style={{
                    display: 'flex',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #2d3339',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team.id)}
                    onChange={() => handleTeamToggle(team.id)}
                  />
                  {team.name}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <button onClick={handleClearFilters} className="btn btn-secondary">
          Clear Filters
        </button>
      )}
    </div>
  );
};
