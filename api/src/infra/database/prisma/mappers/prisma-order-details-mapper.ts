import {
  Order as PrismaOrder,
  Shipping as PrismaShipping,
} from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-objects/order-details';

export class PrismaOrderDetailsMapper {
  static toDomain(order: PrismaOrder, shipping: PrismaShipping): OrderDetails {
    return OrderDetails.create({
      orderId: new UniqueEntityID(order.id),
      trackingCode: order.trackingCode,
      title: order.title,
      status: order.status,
      isReturned: order.isReturned,
      recipientId: new UniqueEntityID(order.clientId),
      recipientName: shipping.clientName,
      recipientAddress: shipping.clientAddress,
      recipientZipcode: shipping.clientZipcode,
      recipientState: shipping.clientState,
      recipientCity: shipping.clientCity,
      recipientNeighborhood: shipping.clientNeighborhood,
      createdAt: order.createdAt,
      deliverymanId: order.deliverymanId
        ? new UniqueEntityID(order.deliverymanId)
        : null,
      updatedAt: order.updatedAt,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
    });
  }
}
