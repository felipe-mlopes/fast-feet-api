import {
  Order as PrismaOrder,
  Shipping as PrismaShipping,
} from '@prisma/client';

import { OrderWithNeighborhood } from '@/domain/delivery/enterprise/entities/value-objects/order-with-neighborhood';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

type PrismaOrderWithNeighborhoodProps = PrismaOrder &
  Pick<PrismaShipping, 'clientNeighborhood'>;

export class PrismaOrderWithNeighborhoodMapper {
  static toDomain(
    raw: PrismaOrderWithNeighborhoodProps,
  ): OrderWithNeighborhood {
    return OrderWithNeighborhood.create({
      orderId: new UniqueEntityID(raw.id),
      trackingCode: raw.trackingCode,
      title: raw.title,
      status: raw.status,
      isReturned: raw.isReturned,
      recipientId: new UniqueEntityID(raw.clientId),
      recipientNeighborhood: raw.shipping.clientNeighborhood,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
