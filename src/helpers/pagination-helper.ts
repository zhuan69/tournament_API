import { Model } from 'mongoose';

export class Pagination {
  static async paginatedResult(
    model: Model<any>,
    page: number,
    ...args
  ): Promise<any> {
    const limit = 10;
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = page * limit;
    const result: any = {};
    const totalDocument = await model
      .find(args[0])
      .countDocuments()
      .exec();
    const totalPage = Math.floor(totalDocument / limit);
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
    if (args.length === 1) {
      result.data = await model
        .find()
        .sort(args[0])
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (args.length === 2) {
      result.data = await model
        .find(args[0])
        .sort(args[1])
        .limit(limit)
        .skip(startIndex)
        .exec();
    }
    return result;
  }
}
