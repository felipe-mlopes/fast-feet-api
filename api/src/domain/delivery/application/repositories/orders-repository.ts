import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findManyRecentByStatus(
    status: Status,
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<Order[]>;
  abstract findManyRecentByCityAndOrdersWaitingAndPicknUp(
    city: string,
    params: PaginationParams,
  ): Promise<Order[] | null>;
  abstract findManyRecentByCityAndOrdersDone(
    city: string,
    params: PaginationParams,
  ): Promise<Order[] | null>;
  abstract create(order: Order): Promise<void>;
  abstract save(order: Order): Promise<void>;
}
