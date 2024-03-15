import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order, Status } from '@/domain/delivery/enterprise/entities/order';
import { Prisma, Order as PrismaOrder, Shipping } from '@prisma/client';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder, client: Shipping): Order {
    return Order.create(
      {
        trackingCode: raw.trackingCode,
        title: raw.title,
        recipientId: new UniqueEntityID(raw.clientId),
        city: client.clientCity,
        neighborhood: client.clientNeighborhood,
        status: raw.status as Status,
        isReturned: raw.isReturned,
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        picknUpAt: raw.picknUpAt ?? null,
        deliveryAt: raw.deliveryAt ?? null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      trackingCode: order.trackingCode,
      title: order.title,
      clientId: order.recipientId.toString(),
      status: order.status,
      isReturned: order.isReturned,
      deliverymanId: order.deliverymanId?.toString() ?? null,
      createdAt: order.createdAt,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
      updatedAt: order.updatedAt,
    };
  }
}
