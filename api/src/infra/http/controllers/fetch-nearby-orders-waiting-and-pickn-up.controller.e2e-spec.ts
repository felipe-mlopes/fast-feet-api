import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';

describe('Fetch Nearby Orders Waiting and Pickn Up (E2E)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let deliverymenFactory: DeliverymenFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, OrderFactory, DeliverymenFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    deliverymenFactory = moduleRef.get(DeliverymenFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /orders/pending', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        city: 'somewhere',
        title: 'order-01',
      }),
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        city: 'somewhere',
        title: 'order-02',
      }),
    ]);

    const deliveryman = await deliverymenFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    });

    const response = await request(app.getHttpServer())
      .get('/orders/pending')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'somewhere',
        page: 1,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.orders).toHaveLength(2);
    expect(response.body.orders).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'order-01',
        }),
      ]),
    );
  });
});
