import { FetchNearbyOrdersDoneUseCase } from './fetch-nearby-orders-done';

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { makeRecipient } from 'test/factories/make-recipient';
import { makeOrder } from 'test/factories/make-orders';
import { makeDeliverymen } from 'test/factories/make-deliverymen';

import { Status } from '@/domain/delivery/enterprise/entities/order';

import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliverymenRepository: InMemoryDeliveryMenRepository;
let sut: FetchNearbyOrdersDoneUseCase;

describe('Fetch Nearby Orders Done', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    );
    inMemoryDeliverymenRepository = new InMemoryDeliveryMenRepository();
    sut = new FetchNearbyOrdersDoneUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymenRepository,
    );
  });

  it('should be able to fetch recent orders done by logged in deliveryman from the same city', async () => {
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
      recipientId: recipient01.id,
    });
    const order3 = makeOrder({
      title: 'Order-03',
      recipientId: recipient01.id,
    });
    const order4 = makeOrder({
      title: 'Order-04',
      recipientId: recipient02.id,
    });
    const order5 = makeOrder({
      title: 'Order-05',
      recipientId: recipient02.id,
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

    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    const anotherDeliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(anotherDeliveryman);

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
    const recipient = makeRecipient({
      city: 'Somewhere City',
    });
    await inMemoryRecipientsRepository.create(recipient);

    const order1 = makeOrder({
      recipientId: recipient.id,
    });
    const order2 = makeOrder({
      recipientId: recipient.id,
    });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);

    const deliveryman = makeDeliverymen();
    const anotherDeliveryman = makeDeliverymen();

    order1.status = Status.DONE;
    order1.deliverymanId = anotherDeliveryman.id;

    order2.status = Status.DONE;
    order2.deliverymanId = anotherDeliveryman.id;

    await inMemoryOrdersRepository.save(order1);
    await inMemoryOrdersRepository.save(order2);

    const result = await sut.execute({
      city: 'Somewhere City',
      page: 1,
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to fetch recent orders that have not been done from the same city or for others that have been delivered', async () => {
    const recipient01 = makeRecipient({
      city: 'Somewhere City',
    });
    await inMemoryRecipientsRepository.create(recipient01);

    const recipient02 = makeRecipient({
      city: 'Anywhere City',
    });
    await inMemoryRecipientsRepository.create(recipient02);

    const order1 = makeOrder({
      recipientId: recipient01.id,
    });
    const order2 = makeOrder({
      recipientId: recipient01.id,
    });
    const order3 = makeOrder({
      recipientId: recipient01.id,
    });
    const order4 = makeOrder({
      recipientId: recipient02.id,
    });

    await inMemoryOrdersRepository.create(order1);
    await inMemoryOrdersRepository.create(order2);
    await inMemoryOrdersRepository.create(order3);
    await inMemoryOrdersRepository.create(order4);

    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    const anotherDeliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(anotherDeliveryman);

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
      city: 'Faraway City',
      page: 1,
      deliverymanId: deliveryman.id.toString(),
    });

    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(0);
    }
  });

  it('should be able to paginated recent orders done by logged in deliveryman from the same city', async () => {
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
          status: Status.DONE,
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
