import { Document } from 'mongoose';

export interface AdminModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  region: {
    district: string;
    subDistrict: string;
  };
  role: string;
}
