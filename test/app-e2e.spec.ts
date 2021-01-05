/* eslint-disable prefer-const */
import { HttpStatus } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthLogin } from '../src/shared/DTO/AuthLogin.dto';
import {
  AdminRegister,
  ClientRegister,
} from '../src/shared/DTO/user-register.dto';
import * as request from 'supertest';
import { Role } from '../src/shared/DTO/user-register.dto';
import * as mongoose from 'mongoose';
import { tournamentType } from '../src/tournament/DTO/tournament.dto';
import { CreateTournament } from 'src/tournament/DTO/tournament.dto';

dotenv.config();
const urlTest = 'http://localhost:4000';

let auth;
let tempData;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('Root route', () => {
  it('/ (Get)', () => {
    return request(urlTest)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('User Register', () => {
  it('Client should success register', () => {
    const registerBody: ClientRegister = {
      firstName: 'Jest',
      lastName: 'Testing',
      email: 'JestTesting@test.com',
      username: 'Jest',
      password: 'testing',
      phone: 62821312384,
      birthday: '99/09/09',
    };
    return request(urlTest)
      .put('/user/register')
      .set('Accept', 'application/json')
      .send(registerBody)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.message).toEqual('Berhasil Register');
      });
  });
  it('Headman should success created', () => {
    const headmanRegisterBody: AdminRegister = {
      firstName: 'Jest',
      lastName: 'Testing',
      email: 'LurahJest@testing.com',
      username: 'jestHead',
      password: 'password',
      region: {
        district: 'Jakarta Utara',
        subDistrict: 'Tj Priok',
      },
      role: Role.headman,
    };
    return request(urlTest)
      .put('/admin/register')
      .set('Accept', 'application/json')
      .send(headmanRegisterBody)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.message).toEqual('Berhasil Register');
        tempData = {
          lurahId: body.resultRegister._id,
        };
      });
  });
  beforeEach(() => {
    return request(urlTest)
      .post('/auth/admin/login')
      .set('Accept', 'application/json')
      .send({ username: 'jestHead', password: 'password' })
      .expect(({ body }) => {
        auth = {
          token: body.token,
        };
      });
  });
  it('Comitte should success register and inherit region from headman', () => {
    const comitteRegisterBody: AdminRegister = {
      firstName: 'Jest',
      lastName: 'Testing',
      email: 'panitiaJest@testing.com',
      username: 'jestPanitia',
      password: 'password',
      role: Role.comitte,
    };
    return request(urlTest)
      .put(`/admin/${tempData.lurahId}/register/comitte`)
      .auth(auth.token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .send(comitteRegisterBody)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.message).toEqual('Success Add Comitte');
        expect(body.resultRegister.region).not.toEqual({});
        tempData = {
          panitiaId: body.resultRegister._id,
        };
      });
  });
});

describe('User Login', () => {
  it('Client should success login', () => {
    const loginBody: AuthLogin = {
      username: 'Jest',
      password: 'testing',
    };
    return request(urlTest)
      .post('/auth/client/login')
      .set('Accept', 'application/json')
      .send(loginBody)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.payload).toBeDefined();
      })
      .expect(HttpStatus.CREATED);
  });
  it('Admin should success login', () => {
    const loginAdmin: AuthLogin = {
      username: 'jestHead',
      password: 'password',
    };
    return request(urlTest)
      .post('/auth/admin/login')
      .set('Accept', 'application/json')
      .send(loginAdmin)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.payload.role).toBeDefined();
      })
      .expect(HttpStatus.CREATED);
  });
});

describe('Tournament API', () => {
  it('Should success create new category', () => {
    return request(urlTest)
      .put('/tournament/category')
      .auth(auth.token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .send({ categoryName: 'Basket' })
      .expect(HttpStatus.CREATED);
  });
  it('Should success create tournament', () => {
    const tournamentBody: CreateTournament = {
      name: 'Jest The International 2021',
      tournamentType: tournamentType.Eliminination,
      category: 'Basket',
      ageRange: 'Dewasa',
      rules: 'Testing Purpose',
      prizePool: {
        firstPrize: 100000,
        secondPrize: 40000,
        thirdPrize: 20000,
      },
      permalink: 'testingjest',
    };
    return request(urlTest)
      .put(`/tournament/create/${tempData.panitiaId}`)
      .auth(auth.token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .send(tournamentBody)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.message).toEqual('Success Create Tournament');
        expect(body.resultCreate._id).toBeDefined();
        expect(body.resultCreate.subDistrict).toEqual('Tj Priok');
      });
  });

  it('Should get list of tournament', () => {
    return request(urlTest)
      .get('/tournament?page=1')
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.message).toEqual('Berhasil dapat index');
        expect(body.resultIndex.data).toBeDefined();
        expect(body.resultIndex.pagination).toBeDefined();
      });
  });

  it('Should get detail data tournament', () => {
    return request(urlTest)
      .get('/tournament/detail/testingjest')
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.message).toEqual('Berhasil dapat detail tournament');
        expect(body.resultDetailTournament).not.toEqual({});
      });
  });

  it('Should get list based on comitte login subdistrict', () => {
    return request(urlTest)
      .get(`/tournament/${tempData.panitiaId}?page=1`)
      .auth(auth.token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.message).toEqual('Berhasil dapat index');
        expect(body.resultIndex.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ subDistrict: 'Tj Priok' }),
          ]),
        );
      });
  });

  it('Should get list avaiable category', () => {
    return request(urlTest)
      .get(`/tournament/category/${tempData.panitiaId}`)
      .auth(auth.token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.message).toEqual(
          'Berhasil dapat data category yang tersedia',
        );
        expect(body.resultAvailableCategory).toHaveLength(0);
      });
  });
});
