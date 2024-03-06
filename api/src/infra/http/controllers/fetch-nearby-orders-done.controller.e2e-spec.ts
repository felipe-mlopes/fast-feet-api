import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderDoneFactory } from 'test/factories/make-orders-done';

describe('Fetch Nearby Orders Done (E2E)', () => {
  let app: INestApplication;
  let deliveryFactory: DeliverymenFactory;
  let recipientFactory: RecipientFactory;
  let orderDoneFactory: OrderDoneFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymenFactory, RecipientFactory, OrderDoneFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    deliveryFactory = moduleRef.get(DeliverymenFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderDoneFactory = moduleRef.get(OrderDoneFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /orders/done', async () => {
    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    });

    const anotherDeliveryman = await deliveryFactory.makePrismaDeliveryman();

    const recipient = await recipientFactory.makePrismaRecipient();

    await Promise.all([
      orderDoneFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliverymanId: anotherDeliveryman.id,
        city: 'somewhere',
        title: 'order-01',
      }),
      orderDoneFactory.makePrismaOrder({
        recipientId: recipient.id,
        deliverymanId: anotherDeliveryman.id,
        city: 'somewhere',
        title: 'order-02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/orders/done')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'somewhere',
        page: 1,
      });

    expect(response.statusCode).toBe(200);
  });
});
