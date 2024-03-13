import { Prisma, Notification as PrismaNotification } from '@prisma/client';

import { Notification } from '@/domain/notification/enterprise/entities/notification';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(raw.shippingId),
        title: raw.title,
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      shippingId: notification.recipientId.toString(),
      title: notification.title,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}
