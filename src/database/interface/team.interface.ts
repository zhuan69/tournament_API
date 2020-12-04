import { Document } from 'mongoose';

enum ApprovalStatus {
  notRegister = 'Not Register',
  approved = 'Approved',
  rejected = 'Rejected',
}

export interface TeamModel extends Document {
  teamName: string;
  memberTeam: string[];
  approval?: ApprovalStatus;
  bracketStatus: string;
}
