import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TournamentModel } from 'src/database/interface/tournament.interface';
import { Pagination } from 'src/helpers/pagination-helper.service';
import { Category, CategoryService } from 'src/shared/service/category.service';
import { TeamService } from 'src/shared/service/team.service';
import { UserService } from 'src/shared/service/user.service';
import {
  CreateTournament,
  ApprovalParticipant,
  EditInfoTournament,
} from '../DTO/tournament.dto';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel('Tournament') private tournamentModel: Model<TournamentModel>,
    private categoryService: CategoryService,
    private userService: UserService,
    private teamService: TeamService,
    private pagination: Pagination,
  ) {}

  async getIndexTournament(page: number): Promise<TournamentModel[]> {
    const indexTournament = await this.pagination.paginatedResult(
      this.tournamentModel,
      page,
    );
    return indexTournament;
  }

  async getIndexByCategory(
    categoryId: string,
    page: number,
  ): Promise<TournamentModel[]> {
    const getTournamentByCategory = await this.pagination.paginatedResult(
      this.tournamentModel,
      page,
      { category: categoryId },
    );
    return getTournamentByCategory;
  }

  async getIndexTournamentByDistrict(
    comitteId: string,
    page: number,
  ): Promise<TournamentModel[]> {
    const getDataComitte = await this.userService.getDetailAdmin(comitteId);
    const indexTournament = await this.pagination.paginatedResult(
      this.tournamentModel,
      page,
      { subDistrict: getDataComitte.region.subDistrict },
    );
    return indexTournament;
  }

  async createTournament(
    comitteId: string,
    tournamentBody: CreateTournament,
  ): Promise<TournamentModel> {
    const {
      name,
      category,
      tournamentType,
      ageRange,
      rules,
      prizePool,
      permalink,
    } = tournamentBody;
    const categoryResult = await this.categoryService.getCategoryByName(
      category,
    );
    const getDataAdmin = await this.userService.getDetailAdmin(comitteId);
    const { subDistrict } = getDataAdmin.region;
    const newTournament = await new this.tournamentModel({
      name: name,
      category: categoryResult._id,
      tournamentType: tournamentType,
      ageRange: ageRange,
      subDistrict: subDistrict,
      rules: rules,
      prizePool: prizePool,
      createdBy: comitteId,
      permalink: permalink,
    });

    return newTournament.save();
  }

  async editInfoTournament(
    tournamentId: string,
    editTournamentBody: EditInfoTournament,
  ): Promise<TournamentModel> {
    const { name, rules, prizePool } = editTournamentBody;
    const editTournament = await this.tournamentModel
      .findByIdAndUpdate(
        tournamentId,
        { $set: { name: name, rules: rules, prizePool: prizePool } },
        { upsert: true },
      )
      .exec();
    return editTournament;
  }

  async registerAsSoloTournament(
    tournamentId: string,
    userId: string,
  ): Promise<any> {
    await this.filterDuplicateSoloRegister(userId);
    const resultRegisterSolo = await this.tournamentModel
      .findByIdAndUpdate(
        tournamentId,
        { $push: { waitingList: userId }, $set: { registerModel: 'Client' } },
        { upsert: true },
      )
      .exec();
    return resultRegisterSolo;
  }

  async registerAsTeamTournament(
    tournamentId: string,
    userId: string,
  ): Promise<TournamentModel> {
    const getDataTeamByUser = await this.teamService.getDataTeamByUserId(
      userId,
    );
    await this.filterDuplicateTeamRegister(getDataTeamByUser._id);
    const resultRegisterTeam = await this.tournamentModel
      .findByIdAndUpdate(
        tournamentId,
        {
          $push: { waitingList: getDataTeamByUser._id },
          $set: { registerModel: 'Team' },
        },
        { upsert: true },
      )
      .exec();
    return resultRegisterTeam;
  }

  async getDetailTournament(tournamentLink: string): Promise<TournamentModel> {
    const resultDetail = await this.filterAvailablityParticipants(
      tournamentLink,
    );
    return resultDetail;
  }

  async getAvailableCategory(comitteId: string): Promise<any> {
    const resultFilter = await this.filterAvailableCategory(comitteId);
    return resultFilter;
  }

  async getTournamentByCategory(
    categoryName: string,
  ): Promise<TournamentModel> {
    const resultData = await this.tournamentModel
      .findOne({ 'category.categoryName': categoryName })
      .exec();
    return resultData;
  }

  async getTournamentByCreated(adminId: string): Promise<any> {
    const resultFilterComitte = await this.tournamentModel
      .findOne({ createdBy: adminId })
      .exec();
    return resultFilterComitte;
  }
  async getWaitingListParticipants(tournamentId: string): Promise<any> {
    const resultWaitingList = await this.tournamentModel
      .findById(tournamentId)
      .exec();
    return resultWaitingList;
  }

  async getSortTournamentAtoZ(page: number): Promise<TournamentModel[]> {
    const sortFromAZ = this.pagination.paginatedResult(
      this.tournamentModel,
      page,
      'sorting',
      {
        name: 1,
      },
    );
    return sortFromAZ;
  }

  async updateUserApprovalPariticipant(
    tournamentId: string,
    approvalBody: ApprovalParticipant,
  ): Promise<any> {
    const resultUpdateApproval = await this.filterSoloApprovalParticipant(
      tournamentId,
      approvalBody,
    );
    return resultUpdateApproval;
  }

  async updateTeamApprovalParticipant(
    tournamentId,
    approvalBody: ApprovalParticipant,
  ): Promise<any> {
    const resultUpdateApproval = await this.filterTeamApprovalParticipant(
      tournamentId,
      approvalBody,
    );
    return resultUpdateApproval;
  }

  async createCategoryTournament(category: Category): Promise<any> {
    const createCategory = await this.categoryService.createNewCategory(
      category,
    );
    return createCategory;
  }

  private async filterDuplicateSoloRegister(userId: string) {
    const filterUser = await this.tournamentModel
      .findOne({ $or: [{ waitingList: userId }, { participants: userId }] })
      .exec();
    if (filterUser)
      throw new BadRequestException(
        `Anda sudah mendaftar tournament di ${filterUser.name} dan tidak bisa mendaftar lebih dari 2 tournament secara bersaaman`,
      );
  }

  private async filterDuplicateTeamRegister(teamId: string) {
    const filterTeam = await this.tournamentModel
      .findOne({ $or: [{ participants: teamId }, { waitingList: teamId }] })
      .exec();
    if (filterTeam)
      throw new BadRequestException(
        `Team anda sudah mendaftar tournament di ${filterTeam.name} dan tidak bisa mendaftar lebih dari 2 tournament secara bersaaman`,
      );
  }

  private async filterTeamApprovalParticipant(
    tournamentId: string,
    approvalBody: ApprovalParticipant,
  ): Promise<any> {
    const { teamId, approval } = approvalBody;
    const updateToTeam = await this.teamService.updateApprovalTeamStatus(
      teamId,
      approval,
    );
    if (approval === 'Rejected') {
      const updateWaitingList = await this.tournamentModel
        .findByIdAndUpdate(
          tournamentId,
          { $pull: { waitingList: updateToTeam._id } },
          { upsert: true },
        )
        .exec();
      return {
        updateWaitingList,
        notification: `Pendaftaran Team anda pada tournament ${updateWaitingList.name} telah di reject oleh panitia`,
      };
    }
    const updateParticipants = await this.tournamentModel
      .findByIdAndUpdate(
        tournamentId,
        {
          $pull: { waitingList: updateToTeam._id },
          $push: { participants: updateToTeam._id },
        },
        { upsert: true },
      )
      .exec();
    return {
      updateParticipants,
      notification: `Pendaftaran Team anda pada tournament ${updateParticipants.name} telah di approve oleh panitia`,
    };
  }

  private async filterSoloApprovalParticipant(
    tournamentId: string,
    approvalBody: ApprovalParticipant,
  ): Promise<any> {
    const { userId, approval } = approvalBody;
    const updateToUser = await this.userService.updateStatusApproval(
      userId,
      approval,
    );
    if (approval === 'Rejected') {
      const updateWaitingList = await this.tournamentModel.findByIdAndUpdate(
        tournamentId,
        { $pull: { waitingList: updateToUser._id } },
        { upsert: true },
      );
      return {
        updateWaitingList,
        notification: `Pendaftaran tournament anda pada tournament ${updateWaitingList.name} telah di reject oleh panitia`,
      };
    }
    const updateParticipants = await this.tournamentModel.findByIdAndUpdate(
      tournamentId,
      {
        $push: { participants: updateToUser._id },
        $pull: { waitingList: updateToUser._id },
      },
      { upsert: true },
    );
    return {
      updateParticipants,
      notification: `Pendaftaran tournament anda pada tournament ${updateParticipants.name} telah di approve oleh panitia`,
    };
  }

  private async filterAvailablityParticipants(
    tournamentLink: string,
  ): Promise<any> {
    const detailTournament = await this.tournamentModel
      .findOne({ permalink: tournamentLink })
      .exec();
    const maxParticipants = 100;
    if (detailTournament.participants === null) {
      return {
        data: detailTournament,
        availablity: maxParticipants,
      };
    }
    const lengthParticipants = detailTournament.participants.length;
    const leftParticipants = maxParticipants - lengthParticipants;
    if (lengthParticipants === maxParticipants) {
      return { availablity: 0 };
    } else {
      return {
        data: detailTournament,
        availablity: leftParticipants,
      };
    }
  }

  private async filterAvailableCategory(comitteId: string): Promise<any> {
    const indexDataCategory = await this.categoryService.getIndexCategory();
    const detailDataComitte = await this.userService.getDetailAdmin(comitteId);
    const { subDistrict } = detailDataComitte.region;
    const indexDataTournament = await this.tournamentModel
      .find({ subDistrict: subDistrict })
      .exec();
    indexDataCategory.forEach((category: any, indexNumberCategory: any) => {
      indexDataTournament.forEach((tournament: any) => {
        const checkIfCategoryUsed =
          category._id.toString() === tournament.category._id.toString();
        if (checkIfCategoryUsed) {
          indexDataCategory.splice(indexNumberCategory, 1);
        }
      });
    });
    return indexDataCategory;
  }
}
