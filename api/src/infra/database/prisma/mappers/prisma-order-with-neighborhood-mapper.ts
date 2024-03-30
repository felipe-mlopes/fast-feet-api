import {
  Order as PrismaOrder,
  Shipping as PrismaShipping,
} from '@prisma/client';

import { OrderWithNeighborhood } from '@/domain/delivery/enterprise/entities/value-objects/order-with-neighborhood';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaOrderWithNeighborhoodMapper {
  static toDomain(
    order: PrismaOrder,
    shipping: PrismaShipping,
  ): OrderWithNeighborhood {
    return OrderWithNeighborhood.create({
      orderId: new UniqueEntityID(order.id),
      trackingCode: order.trackingCode,
      title: order.title,
      status: order.status,
      isReturned: order.isReturned,
      recipientId: new UniqueEntityID(order.clientId),
      recipientNeighborhood: shipping.clientNeighborhood,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }
}
