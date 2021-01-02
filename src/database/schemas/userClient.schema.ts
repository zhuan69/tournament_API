import { hash } from 'bcrypt';
import * as mongoose from 'mongoose';
import { ClientModel } from '../interface/userClient.interface';

export const userClientSchema = new mongoose.Schema({
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
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    index: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  resetPasswordToken: {
    data: String,
    default: '',
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },
  approval: {
    type: String,
    enum: ['Not Registered', 'Approved', 'Rejected'],
    default: 'Not Registered',
    required: true,
  },
  score: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Score',
    autopopulate: true,
  },
  bracketStatus: {
    type: String,
    required: true,
    default: 'Qualifier',
  },
});

userClientSchema.pre<ClientModel>('save', async function(next) {
  const hashing = await hashingPassword(12, this.password);
  this.password = hashing;
  next();
});
userClientSchema.pre<ClientModel>('findByIdAndUpdate', async function(next) {
  const hasing = await hashingPassword(12, this.password);
  this.password = hasing;
  next();
});
async function hashingPassword(saltNumber?: number, password?: string) {
  const hashing = await hash(password, saltNumber);
  return hashing;
}

userClientSchema.index({ username: 'text' });
