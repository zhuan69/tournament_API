import { Document } from 'mongoose';

enum ApprovalStatus {
  notRegister = 'Not Register',
  approved = 'Approved',
  rejected = 'Rejected',
}

export interface ClientModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  age: number;
  resetPasswordToken?: string;
  team?: string;
  approval?: ApprovalStatus;
  bracketStatus: string;
}
