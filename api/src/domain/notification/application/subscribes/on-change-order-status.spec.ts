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

import { makeRecipient } from 'test/factories/make-recipient';
import { makeOrder } from 'test/factories/make-orders';

import { waitFor } from 'test/utils/wait-for';

import { Status } from '@/domain/delivery/enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FakeSendEmail } from 'test/mailing/fake-send-mail';
import { SendEmailParams } from '../mailing/sendEmail';
import { emailTemplate, statusEdit } from '@/infra/mailing/email-template';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let fakeSendEmail: FakeSendEmail;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

let sendEmailExecuteSpy: MockInstance<[SendEmailParams], Promise<void>>;

describe('On Change Order Status', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
      inMemoryRecipientsRepository,
    );
    fakeSendEmail = new FakeSendEmail();

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
    sendEmailExecuteSpy = vi.spyOn(fakeSendEmail, 'send');

    new OnChangeOrderStatus(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
      sendNotificationUseCase,
      fakeSendEmail,
    );
  });

  it('should be able to send a notification when order status is change', async () => {
    const recipient = makeRecipient();
    inMemoryRecipientsRepository.create(recipient);

    const order = makeOrder({
      recipientId: recipient.id,
      title: 'Order-01',
    });
    inMemoryOrdersRepository.create(order);

    recipient.orderIds.push(order.id.toString());
    inMemoryRecipientsRepository.save(recipient);

    order.status = Status.PICKN_UP;
    order.deliverymanId = new UniqueEntityID();

    inMemoryOrdersRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
      expect(sendEmailExecuteSpy).toHaveBeenCalled();
      expect(sendEmailExecuteSpy).toHaveBeenCalledWith({
        to: [recipient.email],
        subject: `O status do seu pedido ${order.title} mudou para ${statusEdit(order.status)}`,
        html: emailTemplate({
          recipientName: recipient.name,
          recipientAddress: recipient.address,
          recipientZipcode: recipient.zipcode,
          recipientNeighborhood: recipient.neighborhood,
          recipientCity: recipient.city,
          orderTitle: order.title,
          orderStatus: order.status,
          orderTrackingCode: order.trackingCode,
        }),
      });
    });
  });
});
