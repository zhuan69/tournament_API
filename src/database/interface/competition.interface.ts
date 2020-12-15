import { Document } from 'mongoose';

export interface CompetitionModel extends Document {
  tournament: string;
  match: string[];
}
export interface MatchModel extends Document {
  competition: string;
  typeBracket: string;
  versus: {
    data: any;
    result: any;
  };
}
