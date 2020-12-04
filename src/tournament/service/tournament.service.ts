import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TournamentModel } from 'src/database/interface/tournament.interface';
import { Pagination } from 'src/helpers/pagination-helper';
import { Category, CategoryService } from 'src/shared/service/category.service';
import { UserService } from 'src/shared/service/user.service';
import { CreateTournament, ApprovalParticipant } from '../DTO/tournament.dto';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel('Tournament') private tournamentModel: Model<TournamentModel>,
    private categoryService: CategoryService,
    private userService: UserService,
  ) {}

  async getIndexTournament(page: number): Promise<TournamentModel[]> {
    const indexTournament = await Pagination.paginatedResult(
      this.tournamentModel,
      page,
    );
    return indexTournament;
  }

  async createTournament(
    comitteId: string,
    tournamentBody: CreateTournament,
  ): Promise<TournamentModel> {
    const { name, category, tournamentType, ageRange } = tournamentBody;
    const categoryResult = await this.categoryService.getCategoryByName(
      category,
    );
    const filterComitte = await this.getTournamentByCreated(comitteId);
    if (filterComitte)
      throw new BadRequestException('Comitte can only create 1 tournament');
    const getDataAdmin = await this.userService.getDetailAdmin(comitteId);
    const { subDistrict } = getDataAdmin.region;
    const newTournament = await new this.tournamentModel({
      name: name,
      category: categoryResult._id,
      tournamentType: tournamentType,
      ageRange: ageRange,
      subDistrict: subDistrict,
      createdBy: comitteId,
    });

    return newTournament.save();
  }

  async registerTournament(tournamentId: string, userId: string): Promise<any> {
    const resultRegister = await this.tournamentModel
      .findByIdAndUpdate(
        tournamentId,
        { $push: { waitingList: userId } },
        { upsert: true },
      )
      .exec();
    return resultRegister;
  }

  async getDetailTournament(tournamentId: string): Promise<TournamentModel> {
    const resultDetail = await this.filterAvailablityParticipants(tournamentId);
    return resultDetail;
  }

  async getAvailableCategory(comitteId: string): Promise<any> {
    const getListCategory = await this.categoryService.getIndexCategory();
    const resultFilter = await this.filterAvailableCategory(comitteId);
    const arrayListCategory = getListCategory;
    if (!resultFilter.exist) {
      return arrayListCategory;
    } else {
      arrayListCategory.splice(resultFilter.index, 1);
      return arrayListCategory;
    }
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
      .populate('waitingList')
      .exec();
    return resultWaitingList;
  }

  async updateApprovalPariticipant(
    tournamentId: string,
    approvalBody: ApprovalParticipant,
  ): Promise<any> {
    const resultUpdateApproval = await this.filterApprovalParticipant(
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

  private async filterApprovalParticipant(
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
        notification:
          'Pendaftaran tournament anda telah di reject oleh panitia',
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
      notification: 'Pendaftaran tournament anda telah di approve oleh panitia',
    };
  }

  private async filterAvailablityParticipants(
    tournamentId: string,
  ): Promise<any> {
    const detailTournament = await this.tournamentModel
      .findById(tournamentId)
      .populate('participants')
      .populate('createdBy')
      .exec();
    const maxParticipants = 100;
    if (!detailTournament.participants) {
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
    let result = {};
    for (let i = 0; i < indexDataCategory.length; i++) {
      for (let j = 0; j < indexDataTournament.length; j++) {
        const checkCategoryIsUsed =
          indexDataTournament[j].category === indexDataCategory[i]._id;
        console.log(checkCategoryIsUsed);

        if (checkCategoryIsUsed) {
          result = {
            index: i,
            exist: true,
          };
        }
      }
    }
    console.log(result);

    return result;
  }
}
