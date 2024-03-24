import { FetchNearbyOrdersDoneUseCase } from './fetch-nearby-orders-done';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { makeOrder } from 'test/factories/make-orders';
import { makeDeliverymen } from 'test/factories/make-deliverymen';

import { Status } from '@/domain/delivery/enterprise/entities/order';

import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliverymenRepository: InMemoryDeliveryMenRepository;
let sut: FetchNearbyOrdersDoneUseCase;

describe('Fetch Nearby Orders Done', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryDeliverymenRepository = new InMemoryDeliveryMenRepository();
    sut = new FetchNearbyOrdersDoneUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymenRepository,
    );
  });

  it('should be able to fetch recent orders done by logged in deliveryman from the same city', async () => {
    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    const anotherDeliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(anotherDeliveryman);

    const order1 = makeOrder({
      city: 'Somewhere City',
    });
    const order2 = makeOrder({
      city: 'Somewhere City',
    });
    const order3 = makeOrder({
      city: 'Somewhere City',
    });
    const order4 = makeOrder({
      city: 'Anywhere City',
    });
    const order5 = makeOrder({
      city: 'Somewhere City',
    });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);
    await inMemoryOrdersRepository.create(order3);
    await inMemoryOrdersRepository.create(order4);
    await inMemoryOrdersRepository.create(order5);

    order1.status = Status.DONE;
    order2.status = Status.DONE;
    order4.status = Status.DONE;
    order5.status = Status.DONE;

    order1.deliverymanId = deliveryman.id;
    order2.deliverymanId = deliveryman.id;
    order4.deliverymanId = deliveryman.id;
    order5.deliverymanId = anotherDeliveryman.id;

    await inMemoryOrdersRepository.save(order1);
    await inMemoryOrdersRepository.save(order2);
    await inMemoryOrdersRepository.save(order4);
    await inMemoryOrdersRepository.save(order5);

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 1,
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.orders).toHaveLength(2);
    }
  });

  it('should not be able to fetch recent orders done without the deliveryman being logged in', async () => {
    const deliveryman = makeDeliverymen();

    const newOrder1 = makeOrder({
      city: 'Somewhere City',
    });
    const newOrder2 = makeOrder({
      city: 'Somewhere City',
    });

    await inMemoryOrdersRepository.create(newOrder1);
    await inMemoryOrdersRepository.create(newOrder2);

    await inMemoryOrdersRepository.save(newOrder1);
    await inMemoryOrdersRepository.save(newOrder2);

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 1,
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to fetch recent orders that have not been done from the same city or for others that have been delivered', async () => {
    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    const anotherDeliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(anotherDeliveryman);

    const order1 = makeOrder({
      city: 'Somewhere City',
    });
    const order2 = makeOrder({
      city: 'Somewhere City',
    });
    const order3 = makeOrder({
      city: 'Somewhere City',
    });
    const order4 = makeOrder({
      city: 'Anywhere City',
    });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);
    await inMemoryOrdersRepository.create(order3);
    await inMemoryOrdersRepository.create(order4);

    order2.deliverymanId = deliveryman.id;
    order3.deliverymanId = anotherDeliveryman.id;
    order4.deliverymanId = deliveryman.id;

    order2.status = Status.PICKN_UP;
    order3.status = Status.DONE;
    order4.status = Status.DONE;

    await inMemoryOrdersRepository.save(order2);
    await inMemoryOrdersRepository.save(order3);
    await inMemoryOrdersRepository.save(order4);

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 1,
      deliverymanId: deliveryman.id.toString(),
    });

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(0);
    }
  });
});
