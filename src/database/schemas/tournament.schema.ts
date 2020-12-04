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
        ref: 'Client',
        maxlength: 100,
      },
    ],
    waitingList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
      },
    ],
    ageRange: { type: [{ type: Number, required: true }] },
    subDistrict: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true },
);

tournamentSchema.plugin(autopopulate);
