import * as mongoose from 'mongoose';

export const logBracketSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  },
  qualifier: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Client',
  },
  quarterFinal: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Client',
    maxlength: 16,
  },
  semiFinal: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Client',
    maxlength: 4,
  },
  final: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Client',
    maxlength: 2,
  },
});
