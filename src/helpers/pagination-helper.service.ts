import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class Pagination {
  async paginatedResult(
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
    // if (args[0] === 'sorting') {
    //   result.data = await this.sortingDocument(
    //     model,
    //     limit,
    //     startIndex,
    //     args[1],
    //     args[2],
    //   );
    //   return result;
    // }
    result.data = await model
      .find(args[0])
      .limit(limit)
      .skip(startIndex)
      .exec();
    return result;
  }
  private async sortingDocument(
    model: Model<any>,
    limit: number,
    startIndex: number,
    ...args
  ) {
    return await model
      .find(args[1])
      .sort(args[0])
      .limit(limit)
      .skip(startIndex);
  }
}
