// Utility functions

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format datetime to readable string with time
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format time only
 */
export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

/**
 * Check if match is live
 */
export function isMatchLive(status: string): boolean {
  return status.toLowerCase() === 'live';
}

/**
 * Check if match is upcoming
 */
export function isMatchUpcoming(status: string): boolean {
  return status.toLowerCase() === 'upcoming';
}

/**
 * Check if match is completed
 */
export function isMatchCompleted(status: string): boolean {
  return status.toLowerCase() === 'completed';
}

/**
 * Get status badge color
 */
export function getStatusColor(
  status: string
): 'live' | 'upcoming' | 'completed' {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'live') return 'live';
  if (lowerStatus === 'completed') return 'completed';
  return 'upcoming';
}

/**
 * Parse overs string "X.Y" to minutes
 */
export function oversToMinutes(overs: number | string): string {
  if (typeof overs === 'string') {
    const [balls, remainder] = overs.split('.');
    const ballsNum = parseInt(balls) || 0;
    const remainderNum = parseInt(remainder) || 0;
    return `${ballsNum}.${remainderNum}`;
  }
  return overs.toString();
}

/**
 * Format team name
 */
export function formatTeamName(name: string): string {
  return name.trim();
}

/**
 * Get short team name
 */
export function getTeamInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

/**
 * Format match result text
 */
export function formatResultText(
  team1: string,
  team2: string,
  result?: string
): string {
  if (!result) return 'Match not started';

  const resultLower = result.toLowerCase();

  if (resultLower.includes('won by')) {
    return result;
  } else if (resultLower.includes('tied')) {
    return `Match tied`;
  } else if (resultLower.includes('drawn')) {
    return `Match drawn`;
  } else if (resultLower.includes('abandoned')) {
    return `Match abandoned`;
  }

  return result;
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in past
 */
export function isPastDate(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Check if date is in future
 */
export function isFutureDate(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

/**
 * Get date range (last N days)
 */
export function getDateRangeFromNow(days: number): {
  startDate: string;
  endDate: string;
} {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Get upcoming date range (next N days)
 */
export function getUpcomingDateRange(days: number): {
  startDate: string;
  endDate: string;
} {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
