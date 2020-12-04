import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { competitionSchema } from 'src/database/schemas/competition.schema';
import { matchSchema } from 'src/database/schemas/match.schema';
import { CompetitionController } from './controller/competition.controller';
import { CompetitionService } from './service/competition.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Competition', schema: competitionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Match', schema: matchSchema }]),
  ],
  controllers: [CompetitionController],
  providers: [CompetitionService],
})
export class CompetitionModule {}
