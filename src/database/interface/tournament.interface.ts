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
  subDistrict: string;
  createdBy: string;
}
