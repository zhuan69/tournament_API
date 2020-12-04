import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user-client/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { TeamModule } from './team/team.module';
import { TournamentModule } from './tournament/tournament.module';
import { CompetitionModule } from './competition/competition.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    SharedModule,
    TeamModule,
    TournamentModule,
    CompetitionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
