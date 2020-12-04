import { Controller, Body, Post } from '@nestjs/common';
import { AuthLogin } from 'src/shared/DTO/AuthLogin.dto';
import { UserService } from 'src/shared/service/user.service';
import { Payload } from '../interface/payload.interface';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('client/login')
  async clientLogin(@Body() loginBody: AuthLogin) {
    const userLogin = await this.userService.clientLoginValidation(loginBody);
    const payload: Payload = {
      userId: userLogin._id,
    };
    const token = await this.authService.signPayload(payload);
    return { token, payload };
  }
  @Post('admin/login')
  async adminLogin(@Body() loginBody: AuthLogin) {
    const adminLogin = await this.userService.adminLoginValidation(loginBody);
    const payload: Payload = {
      userId: adminLogin._id,
      role: adminLogin.role,
    };
    const token = await this.authService.signPayload(payload);
    return { token, payload };
  }
}
