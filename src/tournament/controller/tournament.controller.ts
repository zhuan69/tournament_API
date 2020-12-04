import {
  Controller,
  Get,
  Put,
  Patch,
  Res,
  Body,
  Param,
  HttpStatus,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Category } from 'src/shared/service/category.service';
import { ApprovalParticipant, CreateTournament } from '../DTO/tournament.dto';
import { TournamentService } from '../service/tournament.service';

@Controller('tournament')
export class TournamentController {
  constructor(private tournamentService: TournamentService) {}

  @Get()
  async indexTournament(@Res() res, @Query('page', ParseIntPipe) page) {
    const resultIndex = await this.tournamentService.getIndexTournament(page);
    return res
      .status(HttpStatus.FOUND)
      .json({ message: 'Berhasil dapat index', resultIndex });
  }

  @Put('create/:comitteId')
  async createTournament(
    @Res() res,
    @Param('comitteId') comitteId,
    @Body() tournamentBody: CreateTournament,
  ) {
    const resultCreate = await this.tournamentService.createTournament(
      comitteId,
      tournamentBody,
    );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Success Create Tournament', resultCreate });
  }

  @Patch(':tournamentId/register/:userId')
  async paricipateTournament(@Res() res, @Req() req) {
    const { tournamentId, userId } = req.params;
    const resultParticipate = await this.tournamentService.registerTournament(
      tournamentId,
      userId,
    );
    return res.status(HttpStatus.ACCEPTED).json({
      message: 'Success Participate in Tournament',
      resultParticipate,
    });
  }

  @Get('waitinglist/:tournamentId')
  async getWaitingListParticipant(
    @Res() res,
    @Param('tournamentId') tournamentId,
  ) {
    const resultWaitingList = await this.tournamentService.getWaitingListParticipants(
      tournamentId,
    );
    return res.status(HttpStatus.FOUND).json({
      message: 'Berhasil dapat data waiting list peserta',
      resultWaitingList,
    });
  }

  @Patch('/:tournamentId/approval')
  async updateApprovalParticipant(
    @Res() res,
    @Param('tournamentId') tournamentId,
    @Body() approval: ApprovalParticipant,
  ) {
    const resultUpdate = await this.tournamentService.updateApprovalPariticipant(
      tournamentId,
      approval,
    );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Berhasil mengupdate approval', resultUpdate });
  }

  @Get('category/:comitteId')
  async getAvailableCategory(@Res() res, @Param('comitteId') comitteId) {
    const resultAvailavleCategory = await this.tournamentService.getAvailableCategory(
      comitteId,
    );
    return res.status(HttpStatus.FOUND).json({
      message: 'Berhasil dapat data category yang tersedia',
      resultAvailavleCategory,
    });
  }

  @Get('detail/:tournamentId')
  async getDetailTournament(@Res() res, @Param('tournamentId') tournamentId) {
    const resultDetailTournament = await this.tournamentService.getDetailTournament(
      tournamentId,
    );
    return res.status(HttpStatus.FOUND).json({
      message: 'Berhasil dapat detail tournament',
      resultDetailTournament,
    });
  }
  @Put('category')
  async createCategory(@Res() res, @Body() category: Category) {
    const resultCreateCategory = await this.tournamentService.createCategoryTournament(
      category,
    );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'create berhasil', resultCreateCategory });
  }
}
