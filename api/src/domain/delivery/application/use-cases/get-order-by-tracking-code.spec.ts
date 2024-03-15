import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { GetOrderByTrackingCodeUseCase } from './get-order-by-tracking-code';
import { makeOrder } from 'test/factories/make-orders';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: GetOrderByTrackingCodeUseCase;

describe('Get Order by Tracking Code', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
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
