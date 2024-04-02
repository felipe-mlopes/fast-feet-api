import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mailing/mail.module';

import { OnChangeOrderStatus } from '@/domain/notification/application/subscribes/on-change-order-status';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';

@Module({
  imports: [DatabaseModule, MailModule],
  providers: [OnChangeOrderStatus, SendNotificationUseCase],
})
export class EventsModule {}
