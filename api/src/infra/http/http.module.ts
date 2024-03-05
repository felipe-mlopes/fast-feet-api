import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

import { CreateOrderController } from './controllers/create-order.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthenticateAccountController } from './controllers/authenticate-account.controller';
import { RegisterDeliveryManController } from './controllers/register-deliveryman.controller';
import { RegisterRecipientController } from './controllers/register-recipient.controller';
import { FecthNearbyOrdersWaitingAndPicknUpController } from './controllers/fetch-nearby-orders-waiting-and-pickn-up.controller';
import { FecthNearbyOrdersDoneController } from './controllers/fetch-nearby-orders-done.controller';
import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller';
import { GetOrderDetailsController } from './controllers/get-order-details.controller';

import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';
import { RegisterDeliverymanUseCase } from '@/domain/delivery/application/use-cases/register-deliveryman';
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';
import { FetchNearbyOrdersWaitingAndPicknUpUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-waiting-and-pickn-up';
import { FetchNearbyOrdersDoneUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-done';
import { AuthenticateDeliverymenUseCase } from '@/domain/delivery/application/use-cases/authenticate-deliveryman';
import { GetOrderDetailsUseCase } from '@/domain/delivery/application/use-cases/get-order-details';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateOrderController,
    AuthenticateAccountController,
    RegisterDeliveryManController,
    RegisterRecipientController,
    FecthNearbyOrdersWaitingAndPicknUpController,
    FecthNearbyOrdersDoneController,
    AuthenticateDeliverymanController,
    GetOrderDetailsController,
  ],
  providers: [
    RegisterAdminUseCase,
    CreateOrderUseCase,
    AuthenticateAdminUseCase,
    RegisterDeliverymanUseCase,
    RegisterRecipientUseCase,
    FetchNearbyOrdersWaitingAndPicknUpUseCase,
    FetchNearbyOrdersDoneUseCase,
    AuthenticateDeliverymenUseCase,
    GetOrderDetailsUseCase,
  ],
})
export class HttpModule {}
