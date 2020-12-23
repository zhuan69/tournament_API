import { UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
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
      .status(HttpStatus.OK)
      .json({ message: 'Berhasil dapat index', resultIndex });
  }
  @Get('sort')
  async indexSortTournament(@Res() res, @Query('page', ParseIntPipe) page) {
    const resultIndex = await this.tournamentService.getSortTournamentAtoZ(
      page,
    );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Berhasil dapat sort index', resultIndex });
  }
  @Get(':comitteId')
  @UseGuards(AuthGuard('jwt'))
  async indexTournamentByDistrict(
    @Res() res,
    @Query('page', ParseIntPipe) page,
    @Param('comitteId') comitteId,
  ) {
    const resultIndex = await this.tournamentService.getIndexTournamentByDistrict(
      comitteId,
      page,
    );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Berhasil dapat index', resultIndex });
  }

  @Put('create/:comitteId')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async paricipateTournament(@Res() res, @Req() req) {
    const { tournamentId, userId } = req.params;
    const resultParticipate = await this.tournamentService.registerAsSoloTournament(
      tournamentId,
      userId,
    );
    return res.status(HttpStatus.ACCEPTED).json({
      message: 'Success Participate in Tournament',
      resultParticipate,
    });
  }

  @Patch(':tournamentId/register-team/:userId')
  @UseGuards(AuthGuard('jwt'))
  async paricipateAsTeamTournament(@Res() res, @Req() req) {
    const { tournamentId, userId } = req.params;
    const resultParticipate = await this.tournamentService.registerAsTeamTournament(
      tournamentId,
      userId,
    );
    return res.status(HttpStatus.ACCEPTED).json({
      message: 'Success Participate in Tournament',
      resultParticipate,
    });
  }

  @Get('waitinglist/:tournamentId')
  @UseGuards(AuthGuard('jwt'))
  async getWaitingListParticipant(
    @Res() res,
    @Param('tournamentId') tournamentId,
  ) {
    const resultWaitingList = await this.tournamentService.getWaitingListParticipants(
      tournamentId,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Berhasil dapat data waiting list peserta',
      resultWaitingList,
    });
  }

  @Patch('/:tournamentId/userapproval')
  @UseGuards(AuthGuard('jwt'))
  async updateUserApprovalParticipant(
    @Res() res,
    @Param('tournamentId') tournamentId,
    @Body() approval: ApprovalParticipant,
  ) {
    const resultUpdate = await this.tournamentService.updateUserApprovalPariticipant(
      tournamentId,
      approval,
    );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Berhasil mengupdate approval', resultUpdate });
  }

  @Patch('/:tournamentId/teamapproval')
  @UseGuards(AuthGuard('jwt'))
  async updateTeamApprovalPariticipant(
    @Res() res,
    @Param('tournamentId') tournamentId,
    @Body() approval: ApprovalParticipant,
  ) {
    const resultUpdate = await this.tournamentService.updateTeamApprovalParticipant(
      tournamentId,
      approval,
    );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Berhasil mengupdate approval', resultUpdate });
  }

  @Get('category/:comitteId')
  @UseGuards(AuthGuard('jwt'))
  async getAvailableCategory(@Res() res, @Param('comitteId') comitteId) {
    const resultAvailavleCategory = await this.tournamentService.getAvailableCategory(
      comitteId,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Berhasil dapat data category yang tersedia',
      resultAvailavleCategory,
    });
  }

  @Get('detail/:tournamentLink')
  async getDetailTournament(
    @Res() res,
    @Param('tournamentLink') tournamentLink,
  ) {
    const resultDetailTournament = await this.tournamentService.getDetailTournament(
      tournamentLink,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Berhasil dapat detail tournament',
      resultDetailTournament,
    });
  }
  @Put('category')
  @UseGuards(AuthGuard('jwt'))
  async createCategory(@Res() res, @Body() category: Category) {
    const resultCreateCategory = await this.tournamentService.createCategoryTournament(
      category,
    );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'create berhasil', resultCreateCategory });
  }
}
