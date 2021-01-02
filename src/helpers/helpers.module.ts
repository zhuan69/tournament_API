import { Module } from '@nestjs/common';
import { Pagination } from './pagination-helper.service';

@Module({ providers: [Pagination], exports: [Pagination] })
export class HelpersModule {}
