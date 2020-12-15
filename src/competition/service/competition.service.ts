import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import {
  CompetitionModel,
  MatchModel,
} from 'src/database/interface/competition.interface';
import { TournamentModel } from 'src/database/interface/tournament.interface';
import { TournamentService } from 'src/tournament/service/tournament.service';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectModel('Competition')
    private competitionModel: Model<CompetitionModel>,
    @InjectModel('Match') private matchModel: Model<MatchModel>,
    private tournamentService: TournamentService,
  ) {}

  // async startTournament(tournamentId: string): Promise<any> {
  //   const getDataTournament = await this.tournamentService.getDetailTournament(
  //     tournamentId,
  //   );
  //   const getMatchData = await this.filterTournamentType(getDataTournament);
  //   const newCompetition = new this.competitionModel({});
  // }
  // private createNewMatch(matchData: any, competitionId: string): Promise<any> {
  //   const maxMatchFreeForAll = 20;
  //   const maxMatchElimination = 50;

  //   const matchSize = _.size(matchData);
  //   const generateBracket = Math.floor(matchSize % 2);
  // }
  // private async filterTournamentType(
  //   tournamentData: TournamentModel,
  // ): Promise<any> {
  //   if (tournamentData.tournamentType === 'FreeForAll') {
  //     const randomMatchFreeForAllParticipant = _.chain(
  //       tournamentData.participants,
  //     )
  //       .shuffle()
  //       .chunk(5)
  //       .value();
  //     return randomMatchFreeForAllParticipant;
  //   } else {
  //     const;
  //     const randomChunkData = _.chain(tournamentData.participants)
  //       .shuffle()
  //       .chunk(72)
  //       .value();
  //     const firstMatchData = _.chain(randomChunkData[0])
  //       .shuffle()
  //       .chunk(2)
  //       .value();
  //     const byeMatchData = _.concat(randomChunkData[2]);
  //     return { firstMatch: firstMatchData, byeMatch: byeMatchData };
  //   }
  // }
}
