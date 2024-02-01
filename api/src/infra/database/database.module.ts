import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { DeliveryMenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository';

import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';
import { PrismaDeliverymenRepository } from './prisma/repositories/prisma-deliverymen-repository';
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository';

@Module({
  imports: [],
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
  ],
  exports: [
    PrismaService,
    OrdersRepository,
    RecipentsRepository,
    AdminRepository,
    DeliveryMenRepository,
  ],
})
export class DatabaseModule {}
