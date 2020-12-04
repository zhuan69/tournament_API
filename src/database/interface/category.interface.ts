import { Document } from 'mongoose';

export interface CategoryModel extends Document {
  categoryName: string;
}
