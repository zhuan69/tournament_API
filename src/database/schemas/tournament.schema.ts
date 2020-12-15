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
      },
    ],
    waitingList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'registerModel',
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
    },
  },
  { timestamps: true },
);

tournamentSchema.plugin(autopopulate);
