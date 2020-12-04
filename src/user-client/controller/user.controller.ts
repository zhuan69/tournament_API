import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Res,
} from '@nestjs/common';

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
