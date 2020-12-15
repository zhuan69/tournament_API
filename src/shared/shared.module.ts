import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userAdminSchema } from 'src/database/schemas/userAdmin.schema';
import { userClientSchema } from 'src/database/schemas/userClient.schema';
import { UserService } from './service/user.service';
import { TeamService } from './service/team.service';
import { teamSchema } from 'src/database/schemas/team.schema';
import { CategoryService } from './service/category.service';
import { categorySchema } from 'src/database/schemas/category.schema';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Client', schema: userClientSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: userAdminSchema }]),
    MongooseModule.forFeature([{ name: 'Team', schema: teamSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: categorySchema }]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: '43d88636b5146d',
            pass: '4ee6eb3902980b',
          },
        },
      }),
    }),
  ],
  providers: [UserService, TeamService, CategoryService],
  exports: [UserService, TeamService, CategoryService],
})
export class SharedModule {}
