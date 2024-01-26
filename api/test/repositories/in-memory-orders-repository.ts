import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { Order, Status } from '@/domain/delivery/enterprise/entities/order';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async findManyRecentByStatus(
    status: Status,
    deliverymanId: string,
    { page }: PaginationParams,
  ) {
    const orders = this.items
      .filter(
        (item) =>
          item.status === status &&
          item.deliverymanId?.toString() === deliverymanId,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return orders;
  }

  async findManyRecentNearby(
    status: Status,
    city: string,
    neighborhood: string,
    { page }: PaginationParams,
  ) {
    const orders = this.items
      .filter(
        (item) =>
          item.status === status &&
          item.city === city &&
          item.neighborhood === neighborhood,
      )
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
