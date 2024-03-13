import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper';

import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export function makeNotifications(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence({ min: 3, max: 5 }),
      ...override,
    },
    id,
  );

  return notification;
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotifications(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotifications(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
