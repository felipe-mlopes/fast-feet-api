import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order, Status } from '@/domain/delivery/enterprise/entities/order';
import { Prisma, Order as PrismaOrder, Shipping } from '@prisma/client';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder, client: Shipping): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityID(raw.clientId),
        title: raw.title,
        trackingCode: raw.trackingCode,
        status: raw.status as Status,
        isReturned: raw.isReturned,
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        city: client.clientCity,
        neighborhood: client.clientNeighborhood,
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
      clientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString() ?? null,
      trackingCode: order.trackingCode,
      title: order.title,
      status: order.status,
      isReturned: order.isReturned,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
