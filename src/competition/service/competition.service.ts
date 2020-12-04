import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CompetitionModel } from 'src/database/interface/competition.interface';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectModel('Competition') private competitionModel: CompetitionModel,
  ) {}

  async startTournament(tournamentId: string): Promise<any> {}
}
