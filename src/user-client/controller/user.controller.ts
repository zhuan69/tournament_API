import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  AdminRegister,
  ClientRegister,
} from 'src/shared/DTO/user-register.dto';
import { UserService } from 'src/shared/service/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('register')
  async clientRegister(@Res() res, @Body() clientBody: ClientRegister) {
    const resultRegister = await this.userService.registerClient(clientBody);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Berhasil Register', resultRegister });
  }
  @Get('search')
  async searchUsername(@Res() res, @Query('username') search) {
    const resultSearch = await this.userService.searchUser(search);
    return res
      .status(HttpStatus.FOUND)
      .json({ message: 'Berhasil dapat username' }, resultSearch);
  }
  @Post('forget-password')
  async forgetPasswordUser(@Req() req, @Res() res) {
    const resultForgetPassword = await this.userService.forgotPassword(
      req.body.email,
    );
    return res.status(HttpStatus.OK).json({ resultForgetPassword });
  }
  @Patch('update-profile/:id')
  async updateProfileUser(
    @Res() res,
    @Body() updateBody: ClientRegister,
    @Param('id') userId: string,
  ) {
    const resultUpdateProfile = await this.userService.updateProfile(
      userId,
      updateBody,
    );
    return res.status(HttpStatus.OK).json({ resultUpdateProfile });
  }
}

@Controller('admin')
export class AdminController {
  constructor(private userService: UserService) {}

  @Put('register')
  async adminRegister(@Res() res, @Body() adminBody: AdminRegister) {
    const resultRegister = await this.userService.registerAdmin(adminBody);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Berhasil Register', resultRegister });
  }
  @Put(':id/register/comitte')
  @UseGuards(AuthGuard('jwt'))
  async comitteRegister(
    @Res() res,
    @Param('id') adminId,
    @Body() adminBody: AdminRegister,
  ) {
    const resultRegister = await this.userService.createComitte(
      adminId,
      adminBody,
    );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Success Add Comitte', resultRegister });
  }
}
