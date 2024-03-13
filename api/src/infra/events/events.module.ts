import { OnChangeOrderStatus } from '@/domain/notification/application/subscribes/on-change-order-status';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [OnChangeOrderStatus, SendNotificationUseCase],
})
export class EventsModule {}
