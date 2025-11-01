// Cricket Data Types

export type MatchFormat = 'Test' | 'ODI' | 'T20I' | 'T20' | string;
export type MatchStatus = 'live' | 'upcoming' | 'completed';
export type SeriesStatus = 'ongoing' | 'upcoming' | 'completed';
export type RankingsType = 'teams' | 'players';
export type RankingsFormat = 'test' | 'odi' | 't20';
export type PlayerRankingCategory = 'batting' | 'bowling' | 'allrounder';

export interface Team {
  name: string;
  id: string;
  flag_url?: string;
  score?: number;
  wickets?: number;
  overs?: number;
}

export interface Batsman {
  name: string;
  runs: number;
  balls: number;
  isOut: boolean;
  dismissal?: string;
}

export interface Bowler {
  name: string;
  runs: number;
  wickets: number;
  overs: number;
  maidens?: number;
}

export interface Innings {
  runs: number;
  wickets: number;
  overs: number;
  batsmen?: Batsman[];
  bowlers?: Bowler[];
}

export interface Match {
  matchId: string;
  series: string;
  format: MatchFormat;
  team1: Team;
  team2: Team;
  venue: string;
  date: string; // ISO datetime
  status: MatchStatus;
  result?: string;
  odds?: {
    team1: number;
    team2: number;
    draw: number;
  };
}

export interface MatchDetail {
  matchId: string;
  series: {
    id: string;
    name: string;
  };
  format: MatchFormat;
  team1: Team & {
    flag_url: string;
    innings?: Innings;
  };
  team2: Team & {
    flag_url: string;
    innings?: Innings;
  };
  venue: string;
  city?: string;
  date: string; // ISO datetime
  status: MatchStatus;
  result?: string;
  manOfTheMatch?: string;
  toss?: string;
  odds?: {
    team1: number;
    team2: number;
    draw: number;
  };
}

export interface Series {
  seriesId: string;
  name: string;
  format: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: SeriesStatus;
  participatingTeams: number;
  pointsTable?: PointsTableEntry[];
}

export interface PointsTableEntry {
  position: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  netRunRate?: number;
}

export interface TeamInfo {
  teamId: string;
  name: string;
  shortName?: string;
  flag_url?: string;
  testPlaying: boolean;
  odiPlaying: boolean;
  t20Playing: boolean;
}

export interface TeamDetail extends TeamInfo {
  recentMatches: Array<{
    matchId: string;
    opponent: string;
    result: string;
    date: string;
  }>;
  upcomingMatches: Array<{
    matchId: string;
    opponent: string;
    date: string;
    venue: string;
  }>;
  squad?: Array<{
    name: string;
    role: string;
    country: string;
  }>;
}

export interface RankingEntry {
  position: number;
  name: string;
  teamId?: string;
  points: number;
  rating: number;
  matches?: number;
}

export interface Rankings {
  type: RankingsType;
  format: RankingsFormat;
  category?: PlayerRankingCategory;
  rankings: RankingEntry[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FilterOptions {
  format: MatchFormat | 'all';
  status: MatchStatus | 'all';
  startDate?: string;
  endDate?: string;
  team?: string[]; // team IDs
}
