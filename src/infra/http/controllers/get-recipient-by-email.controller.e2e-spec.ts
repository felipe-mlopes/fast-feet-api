import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { RecipientFactory } from 'test/factories/make-recipient';
import { AdminUserFactory } from 'test/factories/make-admin-user';

describe('Get Recipient by Email (E2E)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let adminUserFactory: AdminUserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, AdminUserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    recipientFactory = moduleRef.get(RecipientFactory);
    adminUserFactory = moduleRef.get(AdminUserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /recipient', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
      email: 'john-doe@example.com',
    });

    const admin = await adminUserFactory.makePrismaAdminUser();

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      name: admin.name,
      role: admin.role,
    });

    const response = await request(app.getHttpServer())
      .get(`/recipient?recipientEmail=${recipient.email}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.recipient).toEqual(
      expect.objectContaining({
        name: 'John Doe',
      }),
    );
  });
});
