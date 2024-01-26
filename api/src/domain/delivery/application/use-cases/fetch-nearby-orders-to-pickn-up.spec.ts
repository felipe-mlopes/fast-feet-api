import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';
import { Status } from '@/domain/delivery/enterprise/entities/order';
import { makeOrder } from 'test/factories/makeOrders';
import { FetchNearbyOrdersToPicknUpUseCase } from './fetch-nearby-orders-to-pickn-up';
import { makeDeliverymen } from 'test/factories/makeDeliverymen';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliverymenRepository: InMemoryDeliveryMenRepository;
let sut: FetchNearbyOrdersToPicknUpUseCase;

describe("Fetch Nearby Orders to Pick'n Up", () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryDeliverymenRepository = new InMemoryDeliveryMenRepository();
    sut = new FetchNearbyOrdersToPicknUpUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymenRepository,
    );
  });

  it("should be able to fetch recent orders with pick'n up status", async () => {
    const newDeliveryman = makeDeliverymen();

    await inMemoryDeliverymenRepository.create(newDeliveryman);

    const newOrder1 = makeOrder({
      city: 'Somewhere City',
      neighborhood: 'Downtown',
    });
    const newOrder2 = makeOrder({
      city: 'Somewhere City',
      neighborhood: 'West',
    });
    const newOrder3 = makeOrder({
      city: 'Somewhere City',
      neighborhood: 'Downtown',
    });

    await inMemoryOrdersRepository.create(newOrder1);
    await inMemoryOrdersRepository.create(newOrder2);
    await inMemoryOrdersRepository.create(newOrder3);

    const deliverymanId = newDeliveryman.id.toString();

    newOrder1.status = Status.PICKN_UP;
    newOrder2.status = Status.PICKN_UP;
    newOrder3.status = Status.PICKN_UP;

    newOrder1.deliverymanId = newDeliveryman.id;
    newOrder2.deliverymanId = newDeliveryman.id;
    newOrder3.deliverymanId = newDeliveryman.id;

    await inMemoryOrdersRepository.save(newOrder1);
    await inMemoryOrdersRepository.save(newOrder2);
    await inMemoryOrdersRepository.save(newOrder3);

    const result = await sut.execute({
      city: 'Somewhere City',
      neighborhood: 'Downtown',
      deliverymanId,
      page: 1,
    });

    expect(result.isRight()).toBe(true);
  });
});
