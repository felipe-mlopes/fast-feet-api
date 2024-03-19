import { Injectable } from '@nestjs/common';

import { SendNotificationUseCase } from '../use-cases/send-notification';

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { ChangeOrderStatusEvent } from '@/domain/delivery/enterprise/events/change-order-status-event';
import { SendEmail } from '../mailing/sendEmail';

import { EventHandler } from '@/core/events/event-handler';
import { DomainEvents } from '@/core/events/domain-events';
import { emailTemplate } from '@/infra/mailing/email-template';

@Injectable()
export class OnChangeOrderStatus implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientRepository: RecipentsRepository,
    private sendNotification: SendNotificationUseCase,
    private sendEmail: SendEmail,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendChangeOrderStatusNotification.bind(this),
      ChangeOrderStatusEvent.name,
    );
  }

  private async sendChangeOrderStatusNotification({
    order,
  }: ChangeOrderStatusEvent) {
    const currentOrder = await this.ordersRepository.findById(
      order.id.toString(),
    );

    const currentRecipient = await this.recipientRepository.findByOrderId(
      order.id.toString(),
    );

    if (currentOrder && currentRecipient && currentOrder.status !== 'WAITING') {
      await Promise.all([
        this.sendNotification.execute({
          recipientId: currentOrder.recipientId.toString(),
          title: `O status do seu pedido ${order.title} mudou para ${order.status}`,
        }),

        this.sendEmail.send({
          to: [currentRecipient.email],
          subject: `O status do seu pedido ${order.title} mudou para ${order.status}`,
          html: emailTemplate({
            recipientName: currentRecipient.name,
            orderStatus: order.status,
          }),
        }),
      ]);
    }
  }
}
