import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { Payload } from '../interface/payload.interface';

@Injectable()
export class AuthService {
  async signPayload(payload: Payload): Promise<any> {
    return sign(payload, process.env.SECRET_KEY, {
      expiresIn: '24h',
    });
  }
}
