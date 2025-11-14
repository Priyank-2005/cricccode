import { IMatch } from '@/lib/models/Match';

export function transformUpcomingMatches(jsonData: any): Partial<IMatch>[] {
  const matches: Partial<IMatch>[] = [];

  if (!jsonData.series_tournaments || !Array.isArray(jsonData.series_tournaments)) {
    console.warn('No series_tournaments array found in JSON');
    return [];
  }

  jsonData.series_tournaments.forEach((tournament: any, index: number) => {
    try {
      const match = transformTournamentToMatch(tournament, index);
      if (match) {
        matches.push(match);
      }
    } catch (error) {
      console.error(`Error transforming tournament ${tournament.name}:`, error);
    }
  });

  return matches;
}

function transformTournamentToMatch(
  tournament: any,
  index: number
): Partial<IMatch> | null {
  // Parse teams from match string
  const teams = parseTeams(tournament.match);

  if (!teams.team1 || !teams.team2) {
    console.warn(`Could not parse teams from: ${tournament.match}`);
    return null;
  }

  // Parse date
  const date = parseDate(tournament.dates);

  // Generate match ID
  const matchId = generateMatchId(tournament, index);

  // Determine format
  const format = determineFormat(tournament.match, tournament.name);

  return {
    matchId,
    series: tournament.name || 'Unknown Series',
    format,
    team1: {
      name: teams.team1,
      id: sanitizeTeamId(teams.team1),
    },
    team2: {
      name: teams.team2,
      id: sanitizeTeamId(teams.team2),
    },
    venue: tournament.venue || 'TBA',
    city: extractCity(tournament.venue),
    date,
    status: 'upcoming',
  };
}

function parseTeams(matchString: string): { team1: string | null; team2: string | null } {
  if (!matchString) {
    return { team1: null, team2: null };
  }

  // Try to split by "vs" or "v"
  const vsRegex = /\s+v(?:s)?\s+/i;
  const parts = matchString.split(vsRegex);

  if (parts.length >= 2) {
    return {
      team1: parts[0].trim(),
      team2: parts[1].trim(),
    };
  }

  // If no vs found, try to parse from brackets or parentheses
  const bracketMatch = matchString.match(/(.+?)\s+\(.*?(\w+)\s+.*?\)/);
  if (bracketMatch) {
    return {
      team1: bracketMatch[1].trim(),
      team2: bracketMatch[2].trim(),
    };
  }

  // Last resort: split by parentheses
  const parenParts = matchString.split(/[\(\)]/);
  if (parenParts.length >= 3) {
    return {
      team1: parenParts[0].trim(),
      team2: parenParts[1].trim(),
    };
  }

  return { team1: null, team2: null };
}

function parseDate(dateString: string): Date {
  if (!dateString) {
    return new Date();
  }

  // Try various date formats
  // "November 2, 2025"
  // "November 3 – 7, 2025"
  // "Starts November 9, 2025"
  // "Starts mid-November 2025"

  // Remove "Starts" and "mid-" prefixes
  let cleanDate = dateString
    .replace(/^Starts\s+/, '')
    .replace(/mid-/, '');

  // Extract first date mentioned
  const dateMatch = cleanDate.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/);

  if (dateMatch) {
    const monthName = dateMatch[1];
    const day = parseInt(dateMatch[2]);
    const year = parseInt(dateMatch[3]);

    const date = new Date(`${monthName} ${day}, ${year}`);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // If only month and year (like "mid-November 2025")
  const monthYearMatch = cleanDate.match(/(\w+)\s+(\d{4})/);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1];
    const year = parseInt(monthYearMatch[2]);

    // Use 15th of the month as default
    const date = new Date(`${monthName} 15, ${year}`);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return new Date();
}

function determineFormat(matchString: string, tournamentName: string): string {
  const combined = `${matchString} ${tournamentName}`.toLowerCase();

  if (combined.includes('test')) return 'Test';
  if (combined.includes('t20i') || combined.includes('t20 international')) return 'T20I';
  if (combined.includes('t20') || combined.includes('t10')) return 'T20';
  if (combined.includes('odi') || combined.includes('one day')) return 'ODI';

  // Default based on series type
  if (tournamentName.includes('Test')) return 'Test';
  if (tournamentName.includes('T20')) return 'T20';
  if (tournamentName.includes('ODI')) return 'ODI';

  return 'ODI'; // Default
}

function generateMatchId(tournament: any, index: number): string {
  const date = parseDate(tournament.dates);
  const dateStr = date.toISOString().split('T')[0];

  const teams = parseTeams(tournament.match);
  const team1Short = teams.team1
    ? teams.team1.substring(0, 3).toUpperCase()
    : 'T1';
  const team2Short = teams.team2
    ? teams.team2.substring(0, 3).toUpperCase()
    : 'T2';

  return `${dateStr}-${team1Short}-${team2Short}-${index}`;
}

function sanitizeTeamId(teamName: string): string {
  return teamName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .substring(0, 20);
}

function extractCity(venueString: string | undefined): string {
  if (!venueString) return '';

  // Extract city name from "City, Country" format
  const cityMatch = venueString.match(/^([^,]+)/);
  return cityMatch ? cityMatch[1].trim() : venueString;
}
