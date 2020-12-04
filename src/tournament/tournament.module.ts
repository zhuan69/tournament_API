import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { tournamentSchema } from 'src/database/schemas/tournament.schema';
import { SharedModule } from 'src/shared/shared.module';
import { TournamentController } from './controller/tournament.controller';
import { TournamentService } from './service/tournament.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Tournament', schema: tournamentSchema },
    ]),
    SharedModule,
  ],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
