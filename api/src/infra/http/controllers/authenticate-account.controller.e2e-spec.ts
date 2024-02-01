import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { hash } from 'bcryptjs';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { AdminUserFactory } from 'test/factories/make-admin-user';

describe('Authenticate Account (E2E)', () => {
  let app: INestApplication;
  let adminUserFactory: AdminUserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminUserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminUserFactory = moduleRef.get(AdminUserFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await adminUserFactory.makePrismaAdminUser({
      email: 'john@example.com',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'xx@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
