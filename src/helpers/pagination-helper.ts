import { Model } from 'mongoose';

export class Pagination {
  static async paginatedResult(
    model: Model<any>,
    page: number,
    options?: any,
  ): Promise<any> {
    const limit = 10;
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = page * limit;
    const totalDocument = await model
      .find(options)
      .countDocuments()
      .exec();
    const totalPage = Math.floor(totalDocument / limit);
    const result: any = {};
    if (endIndex < totalDocument) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex < 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    result.pagination = {
      totalPage: totalPage,
      totalRecord: totalDocument,
      currentPage: page,
      limit: limit,
    };
    result.data = await model
      .find(options)
      .limit(limit)
      .skip(startIndex)
      .exec();
    return result;
  }
}
