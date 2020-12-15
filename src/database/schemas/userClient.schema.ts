import { genSalt, hash } from 'bcrypt';
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
  age: {
    type: Number,
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
  },
  bracketStatus: {
    type: String,
    required: true,
    default: 'Qualifier',
  },
});

userClientSchema.pre<ClientModel>('save', async function(next) {
  const saltNumber = await genSalt(12);
  const hashing = await hash(this.password, saltNumber);
  this.password = hashing;
  next();
});
userClientSchema.pre<ClientModel>('findOneAndUpdate', async function(next) {
  const saltNumber = await genSalt(12);
  const hashing = await hash(this.password, saltNumber);
  this.password = hashing;
  next();
});
userClientSchema.index({ username: 'text' });
