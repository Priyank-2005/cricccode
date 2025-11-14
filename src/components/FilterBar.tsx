import React from 'react';

interface FilterBarProps {
  onFormatChange: (format: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClearFilters: () => void;
  currentFormat: string;
  currentStartDate: string;
  currentEndDate: string;
}

export default function FilterBar({
  onFormatChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
  currentFormat,
  currentStartDate,
  currentEndDate,
}: FilterBarProps) {
  return (
    <div
      style={{
        backgroundColor: '#1a1f26',
        border: '1px solid #2d3339',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}
    >
      <h3 style={{ color: '#e8ecf1', marginTop: 0, marginBottom: '1.5rem' }}>
        Filters
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Format Filter */}
        <div>
          <label
            style={{
              display: 'block',
              color: '#a0aab8',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            Match Format
          </label>
          <select
            value={currentFormat}
            onChange={(e) => onFormatChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#252c35',
              color: '#e8ecf1',
              border: '1px solid #2d3339',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Formats</option>
            <option value="Test">Test</option>
            <option value="ODI">ODI</option>
            <option value="T20">T20</option>
            <option value="T20I">T20I</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label
            style={{
              display: 'block',
              color: '#a0aab8',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            Start Date
          </label>
          <input
            type="date"
            value={currentStartDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#252c35',
              color: '#e8ecf1',
              border: '1px solid #2d3339',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label
            style={{
              display: 'block',
              color: '#a0aab8',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            End Date
          </label>
          <input
            type="date"
            value={currentEndDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#252c35',
              color: '#e8ecf1',
              border: '1px solid #2d3339',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'transparent',
          border: '1px solid #4da6ff',
          color: '#4da6ff',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#4da6ff';
          (e.currentTarget as HTMLElement).style.color = '#000';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.color = '#4da6ff';
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
