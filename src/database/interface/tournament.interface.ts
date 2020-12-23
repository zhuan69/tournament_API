import { Document } from 'mongoose';

enum tournamentType {
  FreeForAll = 'FreeForAll',
  Eliminination = 'Elimination',
}
export interface TournamentModel extends Document {
  name: string;
  category: string;
  tournamentType: tournamentType;
  participants?: string[];
  waitingList?: string[];
  registerModel: string;
  ageRage: string;
  subDistrict: string;
  rules: string;
  prizePool: PrizePoolTournament;
  createdBy: string;
  permalink: string;
}
export interface PrizePoolTournament {
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
}
