import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamModel } from 'src/database/interface/team.interface';
import { TeamRegister } from 'src/team/DTO/team.dto';
import { ApprovalStatus } from '../DTO/approval.enum';

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
      teamName: teamBody.teamName,
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
  async searchTeam(search: string): Promise<any> {
    const searchTeamName = await this.teamModel
      .find({ $text: { $search: search, $caseSensitive: false } })
      .populate('memberTeam')
      .exec();
    return searchTeamName;
  }

  async getDataTeamByUserId(userId: string): Promise<TeamModel> {
    const getDetailTeam = await this.teamModel
      .findOne({ memberTeam: userId })
      .exec();
    if (!getDetailTeam) throw new BadRequestException('Anda belum masuk team');
    return getDetailTeam;
  }

  async updateApprovalTeamStatus(
    teamId: string,
    approval: ApprovalStatus,
  ): Promise<TeamModel> {
    const updateApproval = await this.teamModel
      .findByIdAndUpdate(teamId, { $set: { approval: approval } })
      .exec();
    return updateApproval;
  }
}
