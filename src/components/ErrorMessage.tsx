import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showRetry = false,
}) => {
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <div style={{ flex: 1 }}>
        <p>{message}</p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem' }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = '🏏',
  actionButton,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 style={{ color: '#e8ecf1', marginBottom: '0.5rem' }}>{title}</h3>
      <p className="empty-state-text">{message}</p>
      {actionButton && (
        <button onClick={actionButton.onClick} className="btn btn-primary">
          {actionButton.label}
        </button>
      )}
    </div>
  );
};
