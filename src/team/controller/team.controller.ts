import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamService } from 'src/shared/service/team.service';
import { TeamRegister } from '../DTO/team.dto';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}
  @Put('register/:id')
  @UseGuards(AuthGuard('jwt'))
  async registerTeam(
    @Res() res,
    @Param('id') userId,
    @Body() teamBody: TeamRegister,
  ) {
    const resultTeamRegister = await this.teamService.creatTeam(
      userId,
      teamBody,
    );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Berhasil membuat team', resultTeamRegister });
  }
  @Patch('add-member/:teamId')
  @UseGuards(AuthGuard('jwt'))
  async addTeamMember(
    @Res() res,
    @Param('teamId') teamId,
    @Body() teamBody: TeamRegister,
  ) {
    const resultAddMember = await this.teamService.addMember(teamId, teamBody);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Berhasil nambah member', resultAddMember });
  }
  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async searchTeam(@Res() res, @Query('tname') teamName: string) {
    const resultSearchTeam = await this.teamService.searchTeam(teamName);
    return res
      .status(HttpStatus.FOUND)
      .json({ message: 'Berhasil mencari team', resultSearchTeam });
  }
}
