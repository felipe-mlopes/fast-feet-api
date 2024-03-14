import { Injectable } from '@nestjs/common';

import { NotificationsRepository } from '../repositories/notifications-repository';
import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { SendEmail } from '../mailing/sendEmail';

import { Notification } from '../../enterprise/entities/notification';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
}

export type SendNotificationUseCaseResponse = Either<
  NotAllowedError,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private recipientRepository: RecipentsRepository,
    private sendEmail: SendEmail,
  ) {}

  async execute({
    recipientId,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId);

    if (!recipient) {
      return left(new NotAllowedError());
    }

    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
    });

    await this.notificationsRepository.create(notification);

    await this.sendEmail.send({
      to: [recipient.email],
      subject: notification.title,
      html: 'E-mail enviado com sucesso',
    });

    return right({
      notification,
    });
  }
}
