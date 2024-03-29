import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

import { InMemoryRecipientsRepository } from './in-memory-recipients-repository';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-objects/order-details';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  constructor(private recipientsRepository: InMemoryRecipientsRepository) {}

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async findDetailsById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    const recipient = this.recipientsRepository.items.find((shipping) => {
      return shipping.id.equals(order.recipientId);
    });

    if (!recipient) {
      throw new Error(
        `Recipient with ID "${order.recipientId.toString()}" does not exist.`,
      );
    }

    return OrderDetails.create({
      orderId: order.id,
      trackingCode: order.trackingCode,
      title: order.title,
      status: order.status,
      isReturned: order.isReturned,
      recipientId: order.recipientId,
      recipientName: recipient.name,
      recipientAddress: recipient.address,
      recipientZipcode: recipient.zipcode,
      recipientState: recipient.state,
      recipientCity: recipient.city,
      recipientNeighborhood: recipient.neighborhood,
      createdAt: order.createdAt,
      deliverymanId: order.deliverymanId,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
    });
  }

  async findByTrackingCode(trackingCode: string): Promise<Order | null> {
    const order = this.items.find((item) => item.trackingCode === trackingCode);

    if (!order) {
      return null;
    }

    return order;
  }

  async findManyRecentByCityAndOrdersWaitingAndPicknUp(
    city: string,
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<Order[] | null> {
    const recipient = this.recipientsRepository.items.filter(
      (shipping) => shipping.city === city,
    );

    if (recipient.length < 1) return null;

    const ordersWithRecipient = this.items.filter((item) => {
      return recipient.find((shipping) => shipping.id === item.recipientId);
    });

    const orders = ordersWithRecipient
      .filter((order) => {
        return (
          order.status === Status.WAITING ||
          (order.status === Status.PICKN_UP &&
            order.deliverymanId?.toString() === deliverymanId)
        );
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return orders;
  }

  async findManyRecentByCityAndOrdersDone(
    city: string,
    deliverymanId: string,
    { page }: PaginationParams,
  ) {
    const recipient = this.recipientsRepository.items.filter(
      (shipping) => shipping.city === city,
    );

    if (recipient.length < 1) return null;

    const ordersWithRecipient = this.items.filter((item) => {
      return recipient.find((shipping) => shipping.id === item.recipientId);
    });

    const orders = ordersWithRecipient
      .filter((order) => {
        return (
          order.status === Status.DONE &&
          order.deliverymanId?.toString() === deliverymanId
        );
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return orders;
  }

  async create(order: Order) {
    this.items.push(order);
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items[itemIndex] = order;

    DomainEvents.dispatchEventsForAggregate(order.id);
  }
}
