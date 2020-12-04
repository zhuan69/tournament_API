export enum ApprovalStatus {
  notRegister = 'Not Register',
  approved = 'Approved',
  rejected = 'Rejected',
}
enum tournamentType {
  FreeForAll = 'FreeForAll',
  Eliminination = 'Elimination',
}
export interface CreateTournament {
  name: string;
  category: string;
  tournamentType: tournamentType;
  ageRange: number[];
}

export interface ApprovalParticipant {
  userId: string;
  approval: ApprovalStatus;
}
