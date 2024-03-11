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

describe('Edit Order Status to Pickn Up (E2E)', () => {
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

  test('[GET] /orders/:orderId/picknup', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/picknup`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (orderOnDatabase) {
      expect(orderOnDatabase.status).toEqual('PICKN_UP');
    }
  });
});
