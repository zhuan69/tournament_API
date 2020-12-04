import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MatchModel } from 'src/database/interface/competition.interface';

@Injectable()
export class MatchService {
  constructor(@InjectModel('Match') private matchModel: MatchModel) {}
}
