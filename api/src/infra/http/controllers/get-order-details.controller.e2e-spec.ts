import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

// import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';
import { DeliverymenFactory } from 'test/factories/make-deliverymen';

describe('Get Order Details (E2E)', () => {
  let app: INestApplication;
  // let prisma: PrismaService;
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

    // prisma = moduleRef.get(PrismaService);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    deliverymenFactory = moduleRef.get(DeliverymenFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /orders/:orderId', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();
    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    const deliveryman = await deliverymenFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    });

    const response = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    console.log(response.error);

    expect(response.statusCode).toBe(201);
  });
});
