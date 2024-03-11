import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

import { CreateOrderController } from './controllers/create-order.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthenticateAccountController } from './controllers/authenticate-account.controller';
import { RegisterDeliveryManController } from './controllers/register-deliveryman.controller';
import { RegisterRecipientController } from './controllers/register-recipient.controller';
import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller';
import { GetOrderDetailsController } from './controllers/get-order-details.controller';
import { FecthNearbyOrdersWaitingAndPicknUpController } from './controllers/fetch-nearby-orders-waiting-and-pickn-up.controller';
import { FecthNearbyOrdersDoneController } from './controllers/fetch-nearby-orders-done.controller';
import { EditOrderStatusToPicknUpController } from './controllers/edit-order-status-to-pickn-up.controller';

import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';
import { RegisterDeliverymanUseCase } from '@/domain/delivery/application/use-cases/register-deliveryman';
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';
import { AuthenticateDeliverymenUseCase } from '@/domain/delivery/application/use-cases/authenticate-deliveryman';
import { GetOrderDetailsUseCase } from '@/domain/delivery/application/use-cases/get-order-details';
import { FetchNearbyOrdersWaitingAndPicknUpUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-waiting-and-pickn-up';
import { FetchNearbyOrdersDoneUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-done';
import { EditOrderStatusToPicknUpUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-pickn-up';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    CreateOrderController,
    RegisterDeliveryManController,
    RegisterRecipientController,
    AuthenticateAccountController,
    AuthenticateDeliverymanController,
    EditOrderStatusToPicknUpController,
    FecthNearbyOrdersWaitingAndPicknUpController,
    FecthNearbyOrdersDoneController,
    GetOrderDetailsController,
  ],
  providers: [
    RegisterAdminUseCase,
    CreateOrderUseCase,
    RegisterDeliverymanUseCase,
    RegisterRecipientUseCase,
    AuthenticateAdminUseCase,
    AuthenticateDeliverymenUseCase,
    EditOrderStatusToPicknUpUseCase,
    FetchNearbyOrdersWaitingAndPicknUpUseCase,
    FetchNearbyOrdersDoneUseCase,
    GetOrderDetailsUseCase,
  ],
})
export class HttpModule {}
