import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

import { CreateOrderController } from './controllers/create-order.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthenticateAccountController } from './controllers/authenticate-account.controller';

import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateOrderController,
    AuthenticateAccountController,
  ],
  providers: [
    RegisterAdminUseCase,
    CreateOrderUseCase,
    AuthenticateAdminUseCase,
  ],
})
export class HttpModule {}
