import mongoose, { Schema, Document } from 'mongoose';

export interface IBatsman {
  name: string;
  runs: number;
  balls: number;
  fours?: number;
  sixes?: number;
  isOut?: boolean;
  dismissal?: string;
}

export interface IBowler {
  name: string;
  overs: number;
  runs: number;
  wickets: number;
  maidens?: number;
}

export interface IInnings {
  team: string;
  runs: number;
  wickets: number;
  overs: number;
  batsmen?: IBatsman[];
  bowlers?: IBowler[];
  extras?: {
    byes?: number;
    legbyes?: number;
    wides?: number;
    noBalls?: number;
  };
}

export interface IMatch extends Document {
  matchId: string;
  series: string;
  format: string;
  team1: {
    name: string;
    id: string;
    flag?: string;
  };
  team2: {
    name: string;
    id: string;
    flag?: string;
  };
  venue: string;
  city?: string;
  date: Date;
  status: 'upcoming' | 'live' | 'completed';

  // Match details (for completed matches)
  innings1?: IInnings;
  innings2?: IInnings;
  result?: string;
  winner?: string;
  margin?: {
    type: 'runs' | 'wickets' | 'balls';
    value: number;
  };
  manOfTheMatch?: string;
  toss?: string;
  ballByBall?: any[];

  // Admin fields
  updatedAt?: Date;
  createdAt?: Date;
}

const BatchmanSchema = new Schema<IBatsman>({
  name: String,
  runs: Number,
  balls: Number,
  fours: Number,
  sixes: Number,
  isOut: Boolean,
  dismissal: String,
});

const BowlerSchema = new Schema<IBowler>({
  name: String,
  overs: Number,
  runs: Number,
  wickets: Number,
  maidens: Number,
});

const InningsSchema = new Schema<IInnings>({
  team: String,
  runs: Number,
  wickets: Number,
  overs: Number,
  batsmen: [BatchmanSchema],
  bowlers: [BowlerSchema],
  extras: {
    byes: Number,
    legbyes: Number,
    wides: Number,
    noBalls: Number,
  },
});

const MatchSchema = new Schema<IMatch>(
  {
    matchId: { type: String, unique: true, required: true },
    series: String,
    format: String,
    team1: {
      name: String,
      id: String,
      flag: String,
    },
    team2: {
      name: String,
      id: String,
      flag: String,
    },
    venue: String,
    city: String,
    date: Date,
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed'],
      default: 'upcoming',
    },
    innings1: InningsSchema,
    innings2: InningsSchema,
    result: String,
    winner: String,
    margin: {
      type: {
        type: String,
        enum: ['runs', 'wickets', 'balls'],
      },
      value: Number,
    },
    manOfTheMatch: String,
    toss: String,
    ballByBall: [Schema.Types.Mixed],
  },
  { timestamps: true }
);

export const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
