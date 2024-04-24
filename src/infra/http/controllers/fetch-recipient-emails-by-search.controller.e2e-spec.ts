import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { RecipientFactory } from 'test/factories/make-recipient';
import { AdminUserFactory } from 'test/factories/make-admin-user';

describe('Fetch Recipient Emails by Search (E2E)', () => {
  let app: INestApplication;
  let adminUserFactory: AdminUserFactory;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminUserFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminUserFactory = moduleRef.get(AdminUserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /recipient-email', async () => {
    await Promise.all([
      recipientFactory.makePrismaRecipient({
        email: 'john-doe@test.com',
      }),
      recipientFactory.makePrismaRecipient({
        email: 'john.doe@example.com',
      }),
      recipientFactory.makePrismaRecipient({
        email: 'anyman@xyw.com',
      }),
    ]);

    const adminUser = await adminUserFactory.makePrismaAdminUser();

    const accessToken = jwt.sign({
      sub: adminUser.id.toString(),
      role: adminUser.role,
    });

    const search = 'john';

    const response = await request(app.getHttpServer())
      .get(`/recipient-email?search=${search}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.recipientEmails).toHaveLength(2);
    expect(response.body.recipientEmails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'john-doe@test.com',
        }),
      ]),
    );
  });
});
