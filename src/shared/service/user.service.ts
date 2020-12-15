import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { AdminModel } from 'src/database/interface/userAdmin.interface';
import { ClientModel } from '../../database/interface/userClient.interface';
import { AuthLogin } from '../DTO/AuthLogin.dto';
import { AdminRegister, ClientRegister } from '../DTO/user-register.dto';
import { ApprovalStatus } from '../DTO/approval.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Client') private clientModel: Model<ClientModel>,
    @InjectModel('Admin') private adminModel: Model<AdminModel>,
    private mailerService: MailerService,
  ) {}
  async forgotPassword(email: string): Promise<any> {
    const userData = await this.clientModel.findOne({ email: email }).exec();
    if (!userData) throw new BadRequestException('Email telah dikirim');
    const token = sign({ userId: userData._id }, process.env.SECRET_KEY);
    await this.clientModel
      .findOneAndUpdate(
        { email: email },
        { $set: { resetPasswordToken: token } },
        { upsert: true },
      )
      .exec();
    const option = {
      to: email,
      from: '"s1mple-Tournaments"<s1mple-tournamments@tournament.com>',
      subject: 'Reset link password',
      html: `<p>Hello ${userData.username}, here link for reset your password <a href=${token}>Reset Password</a></p>`,
    };
    this.mailerService
      .sendMail(option)
      .then(res => console.log(res))
      .catch(err => console.log(err));
    return {
      message: 'Link untuk reset password sudah di kirim ke email anda',
    };
  }
  async updateProfile(
    userId: string,
    userUpdate: ClientRegister,
  ): Promise<ClientModel> {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      age,
      team,
    } = userUpdate;
    const updateUserInfo = await this.clientModel
      .findByIdAndUpdate(
        userId,
        { $set: { firstName, lastName, email, username, password, age, team } },
        { upsert: true },
      )
      .exec();
    return updateUserInfo;
  }
  async clientLoginValidation(authLogin: AuthLogin): Promise<any> {
    const { email, username, password } = authLogin;
    const resultClient = await this.clientModel
      .findOne({ $or: [{ username: username }, { email: email }] })
      .exec();
    const clientValidate = await this.validateInputLogin(
      resultClient,
      password,
    );
    return clientValidate;
  }
  async adminLoginValidation(authLogin: AuthLogin): Promise<any> {
    const { email, username, password } = authLogin;
    const resultAdmin = await this.adminModel
      .findOne({ $or: [{ username: username }, { email: email }] })
      .exec();
    const adminValidate = await this.validateInputLogin(resultAdmin, password);
    return adminValidate;
  }
  async registerClient(clientBody: ClientRegister): Promise<ClientModel> {
    const resultRegister = await new this.clientModel(clientBody);
    return resultRegister.save();
  }
  async registerAdmin(adminBody: AdminRegister): Promise<AdminModel> {
    const resultRegister = await new this.adminModel(adminBody);
    return resultRegister.save();
  }
  async createComitte(
    adminId: string,
    adminBody: AdminRegister,
  ): Promise<AdminModel> {
    const { firstName, lastName, email, username, password, role } = adminBody;
    const getDataLurah = await this.getDetailAdmin(adminId);
    if (getDataLurah.role !== 'Headman')
      throw new BadRequestException('Only Headman can add new Comitte');
    const { district, subDistrict } = getDataLurah.region;
    const resultCreate = await new this.adminModel({
      firstName,
      lastName,
      email,
      username,
      password,
      region: { district: district, subDistrict: subDistrict },
      role,
    });
    return resultCreate.save();
  }
  async getIndexAdmin(): Promise<AdminModel[]> {
    const resultIndex = await this.adminModel.find().exec();
    return resultIndex;
  }
  async getDetailAdmin(adminId: string): Promise<AdminModel> {
    const resultDetail = await this.adminModel.findById(adminId).exec();
    return resultDetail;
  }
  async getDetailUser(userId: string): Promise<ClientModel> {
    const resultDetail = await this.clientModel.findById(userId).exec();
    return resultDetail;
  }
  async updateStatusApproval(
    userId: string,
    approvalStatus: ApprovalStatus,
  ): Promise<ClientModel> {
    const updateApproval = await this.clientModel.findByIdAndUpdate(
      userId,
      {
        $set: { approval: approvalStatus },
      },
      { upsert: true },
    );
    if (!updateApproval)
      throw new BadRequestException('Username yang ada cari tida ada');
    return updateApproval;
  }
  async searchUser(search: string): Promise<ClientModel[]> {
    const searchUsername = await this.clientModel.find({
      $text: { $search: search, $caseSensitive: false },
    });
    return searchUsername;
  }
  private async validateInputLogin(resultRecord, password: string) {
    if (!resultRecord)
      throw new BadRequestException('Username atau password salah');
    const verifyPassword = await compare(password, resultRecord.password);
    if (!verifyPassword)
      throw new BadRequestException('Username atau password salah');
    return resultRecord;
  }
}
