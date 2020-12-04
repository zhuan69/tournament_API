import * as mongoose from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

export const competitionSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  },
  match: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  ],
});

competitionSchema.plugin(autopopulate);
