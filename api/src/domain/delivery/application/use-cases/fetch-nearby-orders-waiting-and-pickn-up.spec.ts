import { FetchNearbyOrdersWaitingAndPicknUpUseCase } from './fetch-nearby-orders-waiting-and-pickn-up';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { makeOrder } from 'test/factories/make-orders';
import { makeDeliverymen } from 'test/factories/make-deliverymen';

import { Status } from '@/domain/delivery/enterprise/entities/order';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { makeRecipient } from 'test/factories/make-recipient';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliverymenRepository: InMemoryDeliveryMenRepository;
let sut: FetchNearbyOrdersWaitingAndPicknUpUseCase;

describe("Fetch Nearby Orders Waiting and Pick'n Up", () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    );
    inMemoryDeliverymenRepository = new InMemoryDeliveryMenRepository();
    sut = new FetchNearbyOrdersWaitingAndPicknUpUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymenRepository,
    );
  });

  it('should be able to fetch recent orders of the same city with waiting status and those picked up by deliveryman logged in', async () => {
    const recipient01 = makeRecipient({
      city: 'Somewhere City',
    });
    await inMemoryRecipientsRepository.create(recipient01);

    const recipient02 = makeRecipient({
      city: 'Anywhere City',
    });
    await inMemoryRecipientsRepository.create(recipient02);

    const recipient03 = makeRecipient({
      city: 'Somewhere City',
    });
    await inMemoryRecipientsRepository.create(recipient03);

    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    const anotherDeliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(anotherDeliveryman);

    const order1 = makeOrder({
      title: 'order-01',
      recipientId: recipient01.id,
    });
    const order2 = makeOrder({
      title: 'order-02',
      recipientId: recipient01.id,
    });
    const order3 = makeOrder({
      title: 'order-03',
      recipientId: recipient01.id,
    });
    const order4 = makeOrder({
      title: 'order-04',
      recipientId: recipient03.id,
    });
    const order5 = makeOrder({
      title: 'order-05',
      recipientId: recipient02.id,
    });
    const order6 = makeOrder({
      title: 'order-06',
      recipientId: recipient02.id,
    });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);
    await inMemoryOrdersRepository.create(order3);
    await inMemoryOrdersRepository.create(order4);
    await inMemoryOrdersRepository.create(order5);
    await inMemoryOrdersRepository.create(order6);

    order1.status = Status.PICKN_UP;
    order2.status = Status.DONE;
    order3.status = Status.WAITING;
    order4.status = Status.WAITING;
    order5.status = Status.PICKN_UP;
    order6.status = Status.WAITING;

    order1.deliverymanId = deliveryman.id;
    order2.deliverymanId = deliveryman.id;
    order5.deliverymanId = anotherDeliveryman.id;

    await inMemoryOrdersRepository.save(order1);
    await inMemoryOrdersRepository.save(order2);
    await inMemoryOrdersRepository.save(order3);
    await inMemoryOrdersRepository.save(order4);
    await inMemoryOrdersRepository.save(order5);

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      city: 'Somewhere City',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.orders).toHaveLength(3);
    }
  });

  it('should not be able to fetch recent orders pending without the deliveryman being logged in', async () => {
    const recipient = makeRecipient({
      city: 'Somewhere City',
    });
    await inMemoryRecipientsRepository.create(recipient);

    const newOrder1 = makeOrder({
      recipientId: recipient.id,
    });
    const newOrder2 = makeOrder({
      recipientId: recipient.id,
    });

    await inMemoryOrdersRepository.create(newOrder1);
    await inMemoryOrdersRepository.create(newOrder2);

    const newDeliveryman = makeDeliverymen();

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 1,
      deliverymanId: newDeliveryman.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to fetch recent orders of the different cities with waiting status or picked up by deliveryman logged in', async () => {
    const recipient01 = makeRecipient({
      city: 'Somewhere City',
    });
    await inMemoryRecipientsRepository.create(recipient01);

    const recipient02 = makeRecipient({
      city: 'Anywhere City',
    });
    await inMemoryRecipientsRepository.create(recipient02);

    const order1 = makeOrder({
      title: 'Order-01',
      recipientId: recipient01.id,
    });
    const order2 = makeOrder({
      title: 'Order-02',
      recipientId: recipient02.id,
    });
    const order3 = makeOrder({
      title: 'Order-03',
      recipientId: recipient02.id,
    });
    const order4 = makeOrder({
      title: 'Order-04',
      recipientId: recipient02.id,
    });
    const order5 = makeOrder({
      title: 'Order-05',
      recipientId: recipient01.id,
    });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);
    await inMemoryOrdersRepository.create(order3);
    await inMemoryOrdersRepository.create(order4);
    await inMemoryOrdersRepository.create(order5);

    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    const anotherDeliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(anotherDeliveryman);

    order1.deliverymanId = deliveryman.id;
    order2.deliverymanId = deliveryman.id;
    order3.deliverymanId = deliveryman.id;
    order5.deliverymanId = anotherDeliveryman.id;

    order1.status = Status.DONE;
    order2.status = Status.DONE;
    order3.status = Status.PICKN_UP;
    order5.status = Status.PICKN_UP;

    await inMemoryOrdersRepository.save(order1);
    await inMemoryOrdersRepository.save(order2);
    await inMemoryOrdersRepository.save(order5);

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      city: 'Faraway City',
      page: 1,
    });

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(0);
    }
  });

  it('should be able to paginated recent orders of the same city with waiting status and those picked up by deliveryman logged in', async () => {
    const recipient = makeRecipient({
      city: 'Somewhere City',
    });
    await inMemoryRecipientsRepository.create(recipient);

    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    for (let i = 1; i <= 22; i++) {
      await inMemoryOrdersRepository.create(
        makeOrder({
          title: `Order-${i}`,
          recipientId: recipient.id,
          deliverymanId: deliveryman.id,
        }),
      );
    }

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 2,
      deliverymanId: deliveryman.id.toString(),
    });

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(2);
    }
  });
});
