import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Order, Status } from '../entities/order';

export class ChangeOrderStatusEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public status: Status;

  constructor(order: Order, status: Status) {
    this.order = order;
    this.status = status;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}
