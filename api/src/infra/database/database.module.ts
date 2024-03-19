import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/cache.module';
import { PrismaService } from './prisma/prisma.service';

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { DeliveryMenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository';
import { AttachmentRepository } from '@/domain/delivery/application/repositories/attachment-repository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';

import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';
import { PrismaDeliverymenRepository } from './prisma/repositories/prisma-deliverymen-repository';
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository';
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: RecipentsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: AdminRepository,
      useClass: PrismaAdminRepository,
    },
    {
      provide: DeliveryMenRepository,
      useClass: PrismaDeliverymenRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    OrdersRepository,
    RecipentsRepository,
    AdminRepository,
    DeliveryMenRepository,
    AttachmentRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
