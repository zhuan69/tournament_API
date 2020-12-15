import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { competitionSchema } from 'src/database/schemas/competition.schema';
import { matchSchema } from 'src/database/schemas/match.schema';
import { TournamentModule } from 'src/tournament/tournament.module';
import { CompetitionController } from './controller/competition.controller';
import { CompetitionService } from './service/competition.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Competition', schema: competitionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Match', schema: matchSchema }]),
    TournamentModule,
  ],
  controllers: [CompetitionController],
  providers: [CompetitionService],
})
export class CompetitionModule {}
