import * as mongoose from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

export const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      autopopulate: true,
    },
    tournamentType: {
      type: String,
      enum: ['FreeForAll', 'Elimination'],
      required: true,
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
      required: true,
    },
    rules: {
      type: String,
      required: true,
    },
    prizePool: {
      firstPrize: {
        type: Number,
        min: 0,
        required: true,
      },
      secondPrize: {
        type: Number,
        min: 0,
        required: true,
      },
      thirdPrize: {
        type: Number,
        min: 0,
        required: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      autopopulate: true,
    },
    permalink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

tournamentSchema.plugin(autopopulate);
