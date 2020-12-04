import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamModel } from 'src/database/interface/team.interface';
import { TeamRegister } from 'src/team/DTO/team.dto';

@Injectable()
export class TeamService {
  constructor(@InjectModel('Team') private teamModel: Model<TeamModel>) {}

  async creatTeam(userId: string, teamBody: TeamRegister): Promise<TeamModel> {
    const checkUsedTeamName = await this.teamModel
      .findOne({ teamName: teamBody.teamName })
      .exec();
    if (checkUsedTeamName)
      throw new BadRequestException(
        'Nama team yang anda masukkan sudah terpakai',
      );
    const resultRegister = await new this.teamModel({
      teamBody,
      memberTeam: userId,
    });
    return resultRegister.save();
  }
  async addMember(teamId: string, teamBody: TeamRegister): Promise<TeamModel> {
    const { memberTeam } = teamBody;
    for (let i = 0; i < memberTeam.length; i++) {
      const updateTeamMember = await this.teamModel.findByIdAndUpdate(
        teamId,
        { $push: { memberTeam: memberTeam[i] } },
        { upsert: true },
      );
      return updateTeamMember;
    }
  }
  async searchTeam(search: string): Promise<TeamModel[]> {
    const searchTeamName = await this.teamModel
      .find({ $text: { $search: search, $caseSensitive: false } })
      .populate('memberTeam')
      .exec();
    return searchTeamName;
  }
}
