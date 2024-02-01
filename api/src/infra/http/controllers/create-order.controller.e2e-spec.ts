import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { OrderFactory } from 'test/factories/make-orders';

describe('Create Order (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let orderFactory: OrderFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    orderFactory = moduleRef.get(OrderFactory);

    await app.init();
  });

  test.skip('[POST] /orders', async () => {
    const order = await orderFactory.makePrismaOrder();

    // const accessToken = jwt.sign({ sub: 'xadwvwvdavssdw', role: 'admin' });

    const response = await request(app.getHttpServer()).post('/orders').send({
      title: 'Order 01',
      recipientId: order.recipientId,
      role: 'admin',
    });

    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        title: 'Order 01',
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
