import { ReadNotificationUseCase } from './read-notification';

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';

import { makeNotifications } from 'test/factories/make-notifications';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeOrder } from 'test/factories/make-orders';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new ReadNotificationUseCase(
      inMemoryNotificationsRepository,
      inMemoryOrdersRepository,
    );
  });

  it('should be able to read a notification', async () => {
    const order = makeOrder({
      recipientId: new UniqueEntityID('repicient-01'),
    });

    await inMemoryOrdersRepository.create(order);

    const trackingCode = order.trackingCode;

    const notification = makeNotifications({
      recipientId: order.recipientId,
    });

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      trackingCode,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to read a notification from another user', async () => {
    const order = makeOrder();
    await inMemoryOrdersRepository.create(order);

    const notification = makeNotifications();
    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      trackingCode: 'code-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
