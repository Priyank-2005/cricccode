import {
  Match,
  MatchDetail,
  Series,
  TeamInfo,
  TeamDetail,
  Rankings,
  MatchStatus,
  MatchFormat,
  RankingsFormat,
  PlayerRankingCategory,
} from '@/types/cricket';

const API_BASE_URL = 'https://api.cricapi.com/v1';
const API_KEY = process.env.CRICKET_DATA_API_KEY;

if (!API_KEY) {
  console.warn('CRICKET_DATA_API_KEY is not set in environment variables');
}

class CricketDataApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithTimeout(url: string, timeout = 10000): Promise<any> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      // Check for API success status
      if (json.status !== 'success') {
        throw new Error(`API Error: ${json.info || 'Unknown error'}`);
      }

      return json;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async getMatches(
    format?: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    team?: string[]
  ): Promise<Match[]> {
    const params = new URLSearchParams();

    if (format && format !== 'all') params.append('format', format);
    if (status && status !== 'all') params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (team && team.length > 0) params.append('team', team.join(','));

    const url = `${this.baseUrl}/matches?${params.toString()}`;

    try {
      const data = await this.fetchWithTimeout(url);
      return this.transformMatches(data.data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }

  async getMatchDetail(matchId: string): Promise<MatchDetail | null> {
    const url = `${this.baseUrl}/matches/${matchId}`;

    try {
      const data = await this.fetchWithTimeout(url);
      return this.transformMatchDetail(data.data || {});
    } catch (error) {
      console.error(`Error fetching match detail for ${matchId}:`, error);
      return null;
    }
  }

  async getSeries(status?: string): Promise<Series[]> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);

    const url = `${this.baseUrl}/series?${params.toString()}`;

    try {
      const data = await this.fetchWithTimeout(url);
      return this.transformSeries(data.data || []);
    } catch (error) {
      console.error('Error fetching series:', error);
      return [];
    }
  }

  async getTeams(): Promise<TeamInfo[]> {
    const url = `${this.baseUrl}/teams`;

    try {
      const data = await this.fetchWithTimeout(url);
      return this.transformTeams(data.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async getTeamDetail(teamId: string): Promise<TeamDetail | null> {
    const url = `${this.baseUrl}/teams/${teamId}`;

    try {
      const data = await this.fetchWithTimeout(url);
      return this.transformTeamDetail(data.data || {});
    } catch (error) {
      console.error(`Error fetching team detail for ${teamId}:`, error);
      return null;
    }
  }

  async getRankings(
    type: 'teams' | 'players' = 'teams',
    format?: RankingsFormat,
    category?: PlayerRankingCategory
  ): Promise<Rankings | null> {
    const params = new URLSearchParams();
    params.append('type', type);
    if (format) params.append('format', format);
    if (category) params.append('category', category);

    const url = `${this.baseUrl}/rankings?${params.toString()}`;

    try {
      const data = await this.fetchWithTimeout(url);
      return this.transformRankings(data.data || {});
    } catch (error) {
      console.error('Error fetching rankings:', error);
      return null;
    }
  }

  // Transform methods to normalize API data
  private transformMatches(data: any[]): Match[] {
    return data.map((item) => ({
      matchId: item.id || item.match_id,
      series: item.series || item.series_name || 'Unknown Series',
      format: item.format || 'Unknown',
      team1: {
        name: item.team1 || item.teams?.[0]?.name || 'Team 1',
        id: item.team1_id || item.teams?.[0]?.id || '',
        score: item.team1_score,
        wickets: item.team1_wickets,
        overs: item.team1_overs,
      },
      team2: {
        name: item.team2 || item.teams?.[1]?.name || 'Team 2',
        id: item.team2_id || item.teams?.[1]?.id || '',
        score: item.team2_score,
        wickets: item.team2_wickets,
        overs: item.team2_overs,
      },
      venue: item.venue || 'Unknown Venue',
      date: item.date || item.start_date || new Date().toISOString(),
      status: (item.status || 'upcoming') as MatchStatus,
      result: item.result || item.result_str,
      odds: item.odds
        ? {
            team1: parseFloat(item.odds.team1),
            team2: parseFloat(item.odds.team2),
            draw: parseFloat(item.odds.draw || '0'),
          }
        : undefined,
    }));
  }

  private transformMatchDetail(data: any): MatchDetail {
    return {
      matchId: data.id || data.match_id,
      series: {
        id: data.series_id || '',
        name: data.series || 'Unknown Series',
      },
      format: data.format || 'Unknown',
      team1: {
        name: data.team1 || 'Team 1',
        id: data.team1_id || '',
        flag_url: data.team1_flag_url || '',
        score: data.team1_score,
        wickets: data.team1_wickets,
        overs: data.team1_overs,
        innings: data.team1_innings || {
          runs: data.team1_score || 0,
          wickets: data.team1_wickets || 0,
          overs: data.team1_overs || 0,
        },
      },
      team2: {
        name: data.team2 || 'Team 2',
        id: data.team2_id || '',
        flag_url: data.team2_flag_url || '',
        score: data.team2_score,
        wickets: data.team2_wickets,
        overs: data.team2_overs,
        innings: data.team2_innings || {
          runs: data.team2_score || 0,
          wickets: data.team2_wickets || 0,
          overs: data.team2_overs || 0,
        },
      },
      venue: data.venue || 'Unknown Venue',
      city: data.city,
      date: data.date || data.start_date || new Date().toISOString(),
      status: (data.status || 'upcoming') as MatchStatus,
      result: data.result || data.result_str,
      manOfTheMatch: data.man_of_the_match,
      toss: data.toss,
      odds: data.odds
        ? {
            team1: parseFloat(data.odds.team1),
            team2: parseFloat(data.odds.team2),
            draw: parseFloat(data.odds.draw || '0'),
          }
        : undefined,
    };
  }

  private transformSeries(data: any[]): Series[] {
    return data.map((item) => ({
      seriesId: item.id || item.series_id,
      name: item.name || item.series_name,
      format: item.format || 'Unknown',
      startDate: item.start_date,
      endDate: item.end_date,
      status: (item.status || 'upcoming') as 'ongoing' | 'upcoming' | 'completed',
      participatingTeams: item.teams_count || 0,
      pointsTable: item.points_table || [],
    }));
  }

  private transformTeams(data: any[]): TeamInfo[] {
    return data.map((item) => ({
      teamId: item.id || item.team_id,
      name: item.name,
      shortName: item.short_name,
      flag_url: item.flag_url,
      testPlaying: item.test_playing || false,
      odiPlaying: item.odi_playing || false,
      t20Playing: item.t20_playing || false,
    }));
  }

  private transformTeamDetail(data: any): TeamDetail {
    return {
      teamId: data.id || data.team_id,
      name: data.name,
      shortName: data.short_name,
      flag_url: data.flag_url,
      testPlaying: data.test_playing || false,
      odiPlaying: data.odi_playing || false,
      t20Playing: data.t20_playing || false,
      recentMatches: data.recent_matches || [],
      upcomingMatches: data.upcoming_matches || [],
      squad: data.squad || [],
    };
  }

  private transformRankings(data: any): Rankings {
    return {
      type: data.type || 'teams',
      format: data.format || 'test',
      category: data.category,
      rankings: (data.rankings || []).map((item: any) => ({
        position: item.position || item.rank,
        name: item.name,
        teamId: item.team_id,
        points: item.points || 0,
        rating: item.rating || 0,
        matches: item.matches,
      })),
    };
  }
}

export const cricketApi = new CricketDataApi();
