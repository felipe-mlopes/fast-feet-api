import { SendNotificationUseCase } from './send-notification';

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { makeRecipient } from 'test/factories/make-recipient';

import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should be able to send a notification', async () => {
    const recipient = makeRecipient();

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      title: 'New notification',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      notification: inMemoryNotificationsRepository.items[0],
    });
  });

  it('should not be able to send a notification with diferent recipient', async () => {
    const recipient = makeRecipient();

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientId: 'recipient-02',
      title: 'New notification',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
