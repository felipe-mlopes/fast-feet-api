import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { RecipientFactory } from 'test/factories/make-recipient';
import { AdminUserFactory } from 'test/factories/make-admin-user';

describe('Create Order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminUserFactory: AdminUserFactory;
  let recipientFactory: RecipientFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminUserFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    adminUserFactory = moduleRef.get(AdminUserFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /orders', async () => {
    const admin = await adminUserFactory.makePrismaAdminUser();

    const recipient = await recipientFactory.makePrismaRecipient();

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      name: admin.name,
      role: admin.role,
    });

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
        title: 'New Order',
      });

    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        title: 'new order',
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
