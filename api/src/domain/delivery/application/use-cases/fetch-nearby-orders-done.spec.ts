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

  it('should be able to fetch recent orders with done status', async () => {
    const newDeliveryman = makeDeliverymen();

    await inMemoryDeliverymenRepository.create(newDeliveryman);

    const newOrder1 = makeOrder({
      city: 'Somewhere City',
    });
    const newOrder2 = makeOrder({
      city: 'Somewhere City',
    });
    const newOrder3 = makeOrder({
      city: 'Somewhere City',
    });

    await inMemoryOrdersRepository.create(newOrder1);
    await inMemoryOrdersRepository.create(newOrder2);
    await inMemoryOrdersRepository.create(newOrder3);

    newOrder1.status = Status.DONE;
    newOrder2.status = Status.DONE;
    newOrder3.status = Status.WAITING;

    newOrder1.deliverymanId = newDeliveryman.id;
    newOrder2.deliverymanId = newDeliveryman.id;

    await inMemoryOrdersRepository.save(newOrder1);
    await inMemoryOrdersRepository.save(newOrder2);
    await inMemoryOrdersRepository.save(newOrder3);

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 1,
      deliverymanId: newDeliveryman.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.orders).toHaveLength(2);
    }
  });

  it('should not be able to fetch recent orders without a registered delivery person', async () => {
    const newDeliveryman = makeDeliverymen();

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
      deliverymanId: newDeliveryman.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to fetch recent orders other than done status', async () => {
    const newDeliveryman = makeDeliverymen();

    await inMemoryDeliverymenRepository.create(newDeliveryman);

    const newOrder1 = makeOrder({
      city: 'Somewhere City',
    });
    const newOrder2 = makeOrder({
      city: 'Somewhere City',
    });

    await inMemoryOrdersRepository.create(newOrder1);
    await inMemoryOrdersRepository.create(newOrder2);

    newOrder1.deliverymanId = newDeliveryman.id;
    newOrder2.deliverymanId = newDeliveryman.id;

    await inMemoryOrdersRepository.save(newOrder1);
    await inMemoryOrdersRepository.save(newOrder2);

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 1,
      deliverymanId: newDeliveryman.id.toString(),
    });

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(0);
    }
  });
});
