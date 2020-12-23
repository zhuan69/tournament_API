import * as mongoose from 'mongoose';

export const matchSchema = new mongoose.Schema({
  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
  },
  typeBracket: {
    type: String,
    required: true,
    default: 'Qualifier',
  },
  versus: {
    data: {
      match: [
        { type: mongoose.Schema.Types.ObjectId, refPath: 'registerModel' },
      ],
      registerModel: {
        type: String,
        enum: ['Client', 'Team'],
      },
      results: {
        type: Array,
      },
    },
  },
});
