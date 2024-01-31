import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository';

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
  ],
  exports: [PrismaService, OrdersRepository, RecipentsRepository],
})
export class DatabaseModule {}
