import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { Status } from '@/domain/delivery/enterprise/entities/order';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';

describe('Fetch Nearby Orders Waiting and Pickn Up (E2E)', () => {
  let app: INestApplication;
  let deliveryFactory: DeliverymenFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
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
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /orders/pending', async () => {
    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    });

    const anotherUser = await deliveryFactory.makePrismaDeliveryman();

    const recipient = await recipientFactory.makePrismaRecipient();

    await Promise.all([
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        status: Status.WAITING,
        city: 'somewhere',
      }),
      orderFactory.makePrismaOrder({
        recipientId: recipient.id,
        status: Status.PICKN_UP,
        deliverymanId: anotherUser.id,
        city: 'somewhere',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/orders/pending')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        city: 'somewhere',
        page: 1,
      });

    console.log(response.error);

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
