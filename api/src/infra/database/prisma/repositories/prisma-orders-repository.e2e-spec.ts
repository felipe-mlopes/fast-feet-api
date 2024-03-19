import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { CacheModule } from '@/infra/cache/cache.module';

import { RecipientFactory } from 'test/factories/make-recipient';
import { OrderFactory } from 'test/factories/make-orders';
import { DeliverymenFactory } from 'test/factories/make-deliverymen';

import { CacheRepository } from '@/infra/cache/cache-repository';
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';

describe('Prisma Orders Repository (E2E)', () => {
  let app: INestApplication;
  let recipientFactory: RecipientFactory;
  let orderFactory: OrderFactory;
  let cacheRepository: CacheRepository;
  let ordersRepository: OrdersRepository;

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

    await app.init();
  });

  it('should be cache order details', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    const orderDetails = await ordersRepository.findById(orderId);

    const cached = await cacheRepository.get(`order:${orderId}:details`);

    expect(cached).toEqual(JSON.stringify(orderDetails));
  });

  it('should be return cached order details on subsequent calls', async () => {
    const recipient = await recipientFactory.makePrismaRecipient();

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    });

    const orderId = order.id.toString();

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ empty: true }),
    );

    const orderDetails = await ordersRepository.findById(orderId);

    expect(orderDetails).toEqual({ empty: true });
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
