import * as mongoose from 'mongoose';

export const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
});
