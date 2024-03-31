import { GetOrderByTrackingCodeUseCase } from './get-order-by-tracking-code';

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

import { makeOrder } from 'test/factories/make-orders';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: GetOrderByTrackingCodeUseCase;

describe('Get Order by Tracking Code', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    );
    sut = new GetOrderByTrackingCodeUseCase(inMemoryOrdersRepository);
  });

  it('should be able to get a order by tracking code', async () => {
    const order = makeOrder({
      title: 'order-01',
    });

    await inMemoryOrdersRepository.create(order);

    const result = await sut.execute({
      trackingCode: order.trackingCode,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryOrdersRepository.items[0].title).toBe('order-01');
  });

  it('should not be able to get a order by the missing tracking code', async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const result = await sut.execute({
      trackingCode: 'abc123de',
    });

    expect(result.value?.order).toBeNull();
  });
});
