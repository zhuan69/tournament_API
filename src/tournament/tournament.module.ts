import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { tournamentSchema } from 'src/database/schemas/tournament.schema';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SharedModule } from 'src/shared/shared.module';
import { TournamentController } from './controller/tournament.controller';
import { TournamentService } from './service/tournament.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tournament', schema: tournamentSchema },
    ]),
    SharedModule,
    HelpersModule,
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
