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
import { AttachmentFactory } from 'test/factories/make-attachment';

describe('Edit Order Status to Done (E2E)', () => {
  let app: INestApplication;
  let deliveryFactory: DeliverymenFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let attachmentFactory: AttachmentFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymenFactory,
        RecipientFactory,
        OrderFactory,
        AttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    deliveryFactory = moduleRef.get(DeliverymenFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PACTH] /orders/:orderId/done', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    await attachmentFactory.makePrismaAttachment({
      orderId: order.id,
    });

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        deliverymanId: deliveryman.id.toString(),
        status: 'PICKN_UP',
        picknUpAt: new Date(),
      },
    });

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      name: deliveryman.name,
      role: deliveryman.role,
    });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/done`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    const attachmentOnDatabase = await prisma.attachment.findUnique({
      where: {
        orderId,
      },
    });

    expect(orderOnDatabase?.status).toEqual('DONE');
    expect(attachmentOnDatabase?.orderId).toEqual(orderId);
  });
});
