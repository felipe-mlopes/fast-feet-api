import { MockInstance } from 'vitest';

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';

import { OnChangeOrderStatus } from './on-change-order-status';

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

import { FakeSendEmail } from 'test/mailing/fake-send-mail';

import { makeRecipient } from 'test/factories/make-recipient';
import { makeOrder } from 'test/factories/make-orders';

import { waitFor } from 'test/utils/wait-for';

import { Status } from '@/domain/delivery/enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let fakeSendEmail: FakeSendEmail;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Change Order Status', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    fakeSendEmail = new FakeSendEmail();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
      inMemoryRecipientsRepository,
      fakeSendEmail,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnChangeOrderStatus(inMemoryOrdersRepository, sendNotificationUseCase);
  });

  it('should be able to send a notification when order status is change', async () => {
    const recipient = makeRecipient();
    inMemoryRecipientsRepository.create(recipient);

    const order = makeOrder({
      recipientId: recipient.id,
    });
    inMemoryOrdersRepository.create(order);

    recipient.orderIds.push(order.id.toString());
    inMemoryRecipientsRepository.save(recipient);

    order.status = Status.PICKN_UP;
    order.deliverymanId = new UniqueEntityID();

    inMemoryOrdersRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
