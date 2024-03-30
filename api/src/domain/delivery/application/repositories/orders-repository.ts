import { Order } from '@/domain/delivery/enterprise/entities/order';
import { OrderWithNeighborhood } from '../../enterprise/entities/value-objects/order-with-neighborhood';
import { OrderDetails } from '../../enterprise/entities/value-objects/order-details';

import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>;
  abstract findDetailsById(id: string): Promise<OrderDetails | null>;
  abstract findByTrackingCode(trackingCode: string): Promise<Order | null>;
  abstract findManyRecentByCityAndOrdersWaitingAndPicknUp(
    city: string,
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<OrderWithNeighborhood[] | null>;
  abstract findManyRecentByCityAndOrdersDone(
    city: string,
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<OrderWithNeighborhood[] | null>;
  abstract create(order: Order): Promise<void>;
  abstract save(order: Order): Promise<void>;
}
