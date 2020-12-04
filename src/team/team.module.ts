import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TeamController } from './controller/team.controller';

@Module({
  imports: [SharedModule],
  controllers: [TeamController],
})
export class TeamModule {}
