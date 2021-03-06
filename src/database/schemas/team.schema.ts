import * as mongoose from 'mongoose';

export const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    memberTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        autopopulate: true,
      },
    ],
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
    bracketStatus: { type: String, required: true, default: 'Qualifier' },
  },
  { autoIndex: false },
);

teamSchema.index({ teamName: 'text' });
