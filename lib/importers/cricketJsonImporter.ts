import { IMatch, IBatsman, IBowler } from '@/lib/models/Match';

export function transformCricketJson(jsonData: any): Partial<IMatch> {
  const info = jsonData.info;
  const innings = jsonData.innings || [];

  // Parse teams and scores
  const team1Data = innings[0];
  const team2Data = innings[1];

  // Calculate team scores and wickets
  const team1 = calculateInningsStats(team1Data);
  const team2 = calculateInningsStats(team2Data);

  // Parse outcome
  let result = '';
  let winner = '';
  let status: 'completed' | 'live' | 'upcoming' = 'completed';

  if (info.outcome) {
    winner = info.outcome.winner || '';
    if (info.outcome.by?.wickets) {
      result = `${info.outcome.winner} won by ${info.outcome.by.wickets} wickets`;
    } else if (info.outcome.by?.runs) {
      result = `${info.outcome.winner} won by ${info.outcome.by.runs} runs`;
    } else {
      result = info.outcome.result_type || '';
    }
  }

  // Get match date
  const matchDate = info.dates && info.dates[0] ? new Date(info.dates[0]) : new Date();

  // Create match ID (use series + date + teams)
  const matchId = generateMatchId(info);

  return {
    matchId,
    series: info.event?.name || 'Unknown Series',
    format: info.match_type || 'ODI',
    team1: {
      name: info.teams?.[0] || 'Team 1',
      id: info.teams?.[0]?.toLowerCase() || 'team1',
    },
    team2: {
      name: info.teams?.[1] || 'Team 2',
      id: info.teams?.[1]?.toLowerCase() || 'team2',
    },
    venue: info.venue || 'Unknown Venue',
    city: info.city || '',
    date: matchDate,
    status,
    result,
    winner,
    manOfTheMatch: info.player_of_match?.[0] || '',
    toss: info.toss
      ? `${info.toss.winner} won the toss and chose to ${info.toss.decision}`
      : '',
    innings1: team1,
    innings2: team2,
    ballByBall: team1Data?.overs || [],
  };
}

function calculateInningsStats(inningsData: any) {
  if (!inningsData) {
    return {
      team: '',
      runs: 0,
      wickets: 0,
      overs: 0,
      batsmen: [],
      bowlers: [],
    };
  }

  const overs = inningsData.overs || [];
  let totalRuns = 0;
  let totalWickets = 0;
  let totalBalls = 0;
  const batsmen: Record<string, IBatsman> = {};
  const bowlers: Record<string, IBowler> = {};

  // Parse deliveries from overs
  overs.forEach((over: any) => {
    const deliveries = over.deliveries || [];

    deliveries.forEach((delivery: any) => {
      // Track batsman stats
      if (delivery.batter) {
        if (!batsmen[delivery.batter]) {
          batsmen[delivery.batter] = {
            name: delivery.batter,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            isOut: false,
          };
        }

        const batsmanRuns = delivery.runs?.batter || 0;
        batsmen[delivery.batter].runs += batsmanRuns;
        batsmen[delivery.batter].balls += 1;

        if (batsmanRuns === 4) {
          batsmen[delivery.batter].fours = (batsmen[delivery.batter].fours || 0) + 1;
        } else if (batsmanRuns === 6) {
          batsmen[delivery.batter].sixes = (batsmen[delivery.batter].sixes || 0) + 1;
        }

        totalRuns += batsmanRuns;
      }

      // Track extras
      if (delivery.runs?.extras) {
        totalRuns += delivery.runs.extras;
      }

      // Track wickets
      if (delivery.wickets && delivery.wickets.length > 0) {
        totalWickets += delivery.wickets.length;

        delivery.wickets.forEach((wicket: any) => {
          if (batsmen[wicket.player_out]) {
            batsmen[wicket.player_out].isOut = true;
            batsmen[wicket.player_out].dismissal = wicket.kind;
          }
        });
      }

      // Track bowler stats
      if (delivery.bowler) {
        if (!bowlers[delivery.bowler]) {
          bowlers[delivery.bowler] = {
            name: delivery.bowler,
            overs: 0,
            runs: 0,
            wickets: 0,
            maidens: 0,
          };
        }

        const bowlerRuns = (delivery.runs?.batter || 0) + (delivery.runs?.extras || 0);
        bowlers[delivery.bowler].runs += bowlerRuns;

        if (delivery.wickets && delivery.wickets.length > 0) {
          bowlers[delivery.bowler].wickets += delivery.wickets.length;
        }
      }

      totalBalls += 1;
    });
  });

  return {
    team: inningsData.team || '',
    runs: totalRuns,
    wickets: totalWickets,
    overs: Math.floor(totalBalls / 6) + (totalBalls % 6),
    batsmen: Object.values(batsmen),
    bowlers: Object.values(bowlers),
  };
}

function generateMatchId(info: any): string {
  const date = info.dates?.[0] || new Date().toISOString().split('T')[0];
  const team1 = info.teams?.[0]?.substring(0, 3).toUpperCase() || 'T1';
  const team2 = info.teams?.[1]?.substring(0, 3).toUpperCase() || 'T2';
  const matchNumber = info.event?.match_number || '1';

  return `${date}-${team1}-${team2}-${matchNumber}`;
}
