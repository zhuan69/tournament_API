import { Module } from '@nestjs/common';
import { AdminController, UserController } from './controller/user.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UserController, AdminController],
  providers: [],
})
export class UserModule {}
