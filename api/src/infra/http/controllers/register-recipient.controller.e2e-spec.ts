import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { AdminUserFactory } from 'test/factories/make-admin-user';

describe('Register Recipient (E2E)', () => {
  let app: INestApplication;
  let adminUserFactory: AdminUserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminUserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminUserFactory = moduleRef.get(AdminUserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /recipients', async () => {
    const admin = await adminUserFactory.makePrismaAdminUser();

    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        zipcode: 12345678,
        address: 'Somewhere st',
        neighborhood: 'Downtown',
        city: 'Somewhere city',
      });

    expect(response.statusCode).toBe(201);
  });
});
