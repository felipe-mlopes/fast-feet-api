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
    const anotherDeliveryman = await deliveryFactory.makePrismaDeliveryman();

    const recipient = await recipientFactory.makePrismaRecipient();

    const order01 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: anotherDeliveryman.id,
      city: 'somewhere',
      title: 'order-01',
    });

    await prisma.order.update({
      where: {
        id: order01.id.toString(),
      },
      data: {
        status: 'DONE',
      },
    });

    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    });

    const response = await request(app.getHttpServer())
      .get('/orders/done')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'somewhere',
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
