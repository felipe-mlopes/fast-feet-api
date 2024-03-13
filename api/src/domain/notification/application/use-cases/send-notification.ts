import { Injectable } from '@nestjs/common';

import { NotificationsRepository } from '../repositories/notifications-repository';

import { Notification } from '../../enterprise/entities/notification';

import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
    });

    await this.notificationsRepository.create(notification);

    return right({
      notification,
    });
  }
}
