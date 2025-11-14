import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  width?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  height = '150px',
  width = '100%',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-card"
          style={{ height, width }}
        />
      ))}
    </>
  );
};

interface SkeletonTextProps {
  count?: number;
  lines?: number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  count = 1,
  lines = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {Array.from({ length: lines }).map((_, j) => (
            <div
              key={j}
              className={`skeleton skeleton-text ${j === lines - 1 ? '' : ''}`}
              style={{ marginBottom: '0.5rem' }}
            />
          ))}
        </div>
      ))}
    </>
  );
};

interface MatchCardSkeletonProps {
  count?: number;
}

export const MatchCardSkeleton: React.FC<MatchCardSkeletonProps> = ({
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="match-card">
          <div
            className="skeleton skeleton-text lg"
            style={{ marginBottom: '1rem', width: '200px' }}
          />
          <div
            className="skeleton skeleton-text"
            style={{ marginBottom: '0.5rem' }}
          />
          <div
            className="skeleton skeleton-text"
            style={{ marginBottom: '0.5rem' }}
          />
        </div>
      ))}
    </>
  );
};
