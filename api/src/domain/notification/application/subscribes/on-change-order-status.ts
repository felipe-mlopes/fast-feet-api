import { SendNotificationUseCase } from '../use-cases/send-notification';

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';

import { ChangeOrderStatusEvent } from '@/domain/delivery/enterprise/events/change-order-status-event';

import { EventHandler } from '@/core/events/event-handler';
import { DomainEvents } from '@/core/events/domain-events';

export class OnChangeOrderStatus implements EventHandler {
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotification: SendNotificationUseCase,
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

    if (currentOrder && currentOrder.status !== 'waiting') {
      await this.sendNotification.execute({
        recipientId: currentOrder.recipientId.toString(),
        title: `O status do seu pedido ${order.title} mudou para ${order.status}`,
      });
    }
  }
}
