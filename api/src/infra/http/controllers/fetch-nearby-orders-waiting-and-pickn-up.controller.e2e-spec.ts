import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';
import { OrderFactory } from 'test/factories/make-orders';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

describe('Fetch Nearby Orders Waiting and Pickn Up (E2E)', () => {
  let app: INestApplication;
  let deliveryFactory: DeliverymenFactory;
  let orderFactory: OrderFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymenFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    deliveryFactory = moduleRef.get(DeliverymenFactory);
    orderFactory = moduleRef.get(OrderFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test.skip('[GET] /orders', async () => {
    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() });

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: new UniqueEntityID('client-01'),
        city: 'somewhere',
      }),
      orderFactory.makePrismaOrder({
        recipientId: new UniqueEntityID('client-01'),
        city: 'somewhere',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/orders/somewhere/downtown`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliverymanId: deliveryman.id.toString(),
        page: 1,
      });

    expect(response.statusCode).toBe(200);

    /*    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Question 01',
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Some attachment',
          }),
        ],
      }),
    }); */
  });
});
