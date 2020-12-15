import { ApprovalStatus } from 'src/shared/DTO/approval.enum';

enum tournamentType {
  FreeForAll = 'FreeForAll',
  Eliminination = 'Elimination',
}
export interface CreateTournament {
  name: string;
  category: string;
  tournamentType: tournamentType;
  ageRange: string;
  prizePool: PrizePoolTournament;
}

export interface ApprovalParticipant {
  userId?: string;
  teamId?: string;
  approval: ApprovalStatus;
}

interface PrizePoolTournament {
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
}
