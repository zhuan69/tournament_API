import * as mongoose from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

export const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      autopopulate: true,
    },
    tournamentType: {
      type: String,
      enum: ['FreeForAll', 'Elimination'],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        maxlength: 100,
        refPath: 'registerModel',
        autopopulate: true,
      },
    ],
    waitingList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'registerModel',
        autopopulate: true,
      },
    ],
    registerModel: {
      type: String,
      enum: ['Client', 'Team'],
    },
    ageRange: { type: String, required: true },
    subDistrict: {
      type: String,
    },
    rules: {
      type: String,
    },
    prizePool: {
      firstPrize: {
        type: Number,
        min: 0,
      },
      secondPrize: {
        type: Number,
        min: 0,
      },
      thirdPrize: {
        type: Number,
        min: 0,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      autopopulate: true,
    },
    permalink: {
      type: String,
    },
  },
  { timestamps: true },
);

tournamentSchema.plugin(autopopulate);
