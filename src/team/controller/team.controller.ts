import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Put,
  Res,
} from '@nestjs/common';
import { TeamService } from 'src/shared/service/team.service';
import { TeamRegister } from '../DTO/team.dto';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}
  @Put('register/:id')
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
}
