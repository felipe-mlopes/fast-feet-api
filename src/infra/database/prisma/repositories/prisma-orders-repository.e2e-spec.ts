import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { CacheRepository } from '@/infra/cache/cache-repository';

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';

import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';
import { DeliverymenFactory } from 'test/factories/make-deliverymen';

describe('Prisma Orders Repository (E2E)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let cacheRepository: CacheRepository;
  let ordersRepository: OrdersRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [RecipientFactory, OrderFactory, DeliverymenFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    recipientFactory = moduleRef.get(RecipientFactory);
    orderFactory = moduleRef.get(OrderFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    ordersRepository = moduleRef.get(OrdersRepository);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it('should be cache order details', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    await ordersRepository.findDetailsById(orderId);

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        shipping: true,
      },
    });

    const cached = await cacheRepository.get(`order:${orderId}:details`);

    expect(cached).toEqual(JSON.stringify(orderOnDatabase));
  });

  it('should be return cached order details on subsequent calls', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        shipping: true,
      },
    });

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ ...orderOnDatabase, title: 'cached title' }),
    );

    const orderDetails = await ordersRepository.findDetailsById(orderId);

    expect(orderDetails).toEqual(
      expect.objectContaining({ title: 'cached title' }),
    );
  });

  it('should be reset order details cache when saving the question', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ empty: true }),
    );

    await ordersRepository.save(order);

    const cached = await cacheRepository.get(`order:${orderId}:details`);

    expect(cached).toBeNull();
  });
});
