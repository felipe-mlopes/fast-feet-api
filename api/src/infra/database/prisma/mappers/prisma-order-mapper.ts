import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order, Role } from '@/domain/delivery/enterprise/entities/order';
import { Prisma, Order as PrismaOrder, Shipping } from '@prisma/client';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder, client: Shipping): Order {
    return Order.create(
      {
        title: raw.title,
        recipientId: new UniqueEntityID(raw.clientId),
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        role: Role.ADMIN,
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
      deliverymanId: order.deliverymanId?.toString() ?? '',
      title: order.title,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
