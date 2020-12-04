export interface CompetitionModel extends Document {
  typeBracket: string;
  tournament: string;
  match: string[];
}
export interface MatchModel extends Document {
  competition: string;
  versus: [string, string, string?, string?, string?];
}
