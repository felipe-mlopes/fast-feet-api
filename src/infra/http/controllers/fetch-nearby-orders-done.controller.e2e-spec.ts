import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';

describe('Fetch Nearby Orders Done (E2E)', () => {
  let app: INestApplication;
  let deliveryFactory: DeliverymenFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymenFactory, RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    deliveryFactory = moduleRef.get(DeliverymenFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /orders/done', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      city: 'somewhere',
    });
    const anotherRecipient = await recipientFactory.makePrismaRecipient({
      city: 'anywhere',
    });

    const anotherDeliveryman = await deliveryFactory.makePrismaDeliveryman();
    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      name: deliveryman.name,
      role: deliveryman.role,
    });

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: anotherRecipient.id,
        title: 'order-03',
      }),
      orderFactory.makePrismaOrder({
        recipientId: anotherRecipient.id,
        title: 'order-04',
      }),
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        title: 'order-05',
      }),
    ]);

    const order01 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      title: 'order-01',
    });

    const order02 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      title: 'order-02',
    });

    await Promise.all([
      prisma.order.update({
        where: {
          id: order01.id.toString(),
        },
        data: {
          status: 'DONE',
          deliverymanId: deliveryman.id.toString(),
        },
      }),
      prisma.order.update({
        where: {
          id: order02.id.toString(),
        },
        data: {
          status: 'DONE',
          deliverymanId: anotherDeliveryman.id.toString(),
        },
      }),
    ]);

    const city = 'somewhere';

    const response = await request(app.getHttpServer())
      .get(`/orders/done?city=${city}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        page: 1,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.orders).toHaveLength(1);
    expect(response.body.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'order-01',
        }),
      ]),
    );
  });
});
