import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';

describe('Get Order by Tracking Code and Client Name (E2E)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, OrderFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);

    await app.init();
  });

  test('[GET] /recipient-query', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
    });

    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const order02 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const trackingCode = order02.trackingCode;

    const response = await request(app.getHttpServer())
      .get(`/recipient-query?trackingCode=${trackingCode}`)
      .send();

    expect(response.statusCode).toBe(200);
  });
});
