import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { DeliverymenFactory } from 'test/factories/make-deliverymen';
import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';
import { NotificationFactory } from 'test/factories/make-notifications';

describe('Read Notification (E2E)', () => {
  let app: INestApplication;
  let deliveryFactory: DeliverymenFactory;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let notificationFactory: NotificationFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymenFactory,
        RecipientFactory,
        OrderFactory,
        NotificationFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    deliveryFactory = moduleRef.get(DeliverymenFactory);
    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    notificationFactory = moduleRef.get(NotificationFactory);

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PACTH] /notifications/:notificationId/read', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      trackingCode: 'code-01',
    });

    const deliveryman = await deliveryFactory.makePrismaDeliveryman();

    await prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data: {
        deliverymanId: deliveryman.id.toString(),
        status: 'PICKN_UP',
        picknUpAt: new Date(),
      },
    });

    const notification = await notificationFactory.makePrismaNotifications({
      recipientId: recipient.id,
    });

    const notificationId = notification.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .send({
        trackingCode: 'code-01',
      });

    expect(response.statusCode).toBe(204);
  });
});
