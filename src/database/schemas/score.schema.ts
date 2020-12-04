import * as mongoose from 'mongoose';

export const scoreSchema = new mongoose.Schema({
  winScore: {
    type: Number,
    required: true,
    default: 0,
  },
});
