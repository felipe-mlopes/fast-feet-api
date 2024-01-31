import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';

import { CreateOrderController } from './controllers/create-order.controller';

import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateOrderController],
  providers: [CreateOrderUseCase],
})
export class HttpModule {}
