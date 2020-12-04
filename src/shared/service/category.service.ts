import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryModel } from 'src/database/interface/category.interface';

export interface Category {
  categoryName: string;
}
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<CategoryModel>,
  ) {}

  async getIndexCategory(): Promise<CategoryModel[]> {
    const resultIndex = await this.categoryModel.find().exec();
    return resultIndex;
  }

  async getCategoryByName(categoryName: string): Promise<CategoryModel> {
    const resultCategory = await this.categoryModel
      .findOne({ categoryName: categoryName })
      .exec();
    return resultCategory;
  }

  async createNewCategory(category: Category): Promise<CategoryModel> {
    const resultCreate = await new this.categoryModel(category);
    return resultCreate.save();
  }
}
