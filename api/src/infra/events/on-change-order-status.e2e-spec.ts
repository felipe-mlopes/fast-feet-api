import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma/prisma.service';

import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';
import { DeliverymenFactory } from 'test/factories/make-deliverymen';
import { waitFor } from 'test/utils/wait-for';

import { DomainEvents } from '@/core/events/domain-events';
import { AttachmentFactory } from 'test/factories/make-attachment';

describe('On Change Order Status (E2E)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let deliveryFactory: DeliverymenFactory;
  let attachmentFactory: AttachmentFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RecipientFactory,
        OrderFactory,
        DeliverymenFactory,
        AttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    deliveryFactory = moduleRef.get(DeliverymenFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it("should be send a notification when order status changed to pick'n up", async () => {
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

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/picknup`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          shippingId: recipient.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });

  it('should be send a notification when order status changed to done', async () => {
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
      role: deliveryman.role,
    });

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/done`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          shippingId: recipient.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
