import { genSalt, hash } from 'bcrypt';
import * as mongoose from 'mongoose';
import { AdminModel } from '../interface/userAdmin.interface';

export const userAdminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  region: {
    district: { type: String, required: true },
    subDistrict: { type: String, required: true },
  },
  role: {
    type: String,
    enum: ['Comitte', 'Headman', 'Admin'],
  },
});

userAdminSchema.pre<AdminModel>('save', async function(next) {
  const saltNumber = await genSalt(12);
  const hashing = await hash(this.password, saltNumber);
  this.password = hashing;
  next();
});
