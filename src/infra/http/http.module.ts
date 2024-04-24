import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from '../storage/storage.module';

import { CreateOrderController } from './controllers/create-order.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { RegisterDeliveryManController } from './controllers/register-deliveryman.controller';
import { RegisterRecipientController } from './controllers/register-recipient.controller';
import { AuthenticateAccountController } from './controllers/authenticate-account.controller';
import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller';
import { EditOrderStatusToPicknUpController } from './controllers/edit-order-status-to-pickn-up.controller';
import { EditOrderStatusToDoneController } from './controllers/edit-order-status-to-done.controller';
import { EditOrderStatusToReturnController } from './controllers/edit-order-status-to-return.controller';
import { UploadAndCreateAttachmentController } from './controllers/upload-and-create-attachment.controller';
import { FecthNearbyOrdersWaitingAndPicknUpController } from './controllers/fetch-nearby-orders-waiting-and-pickn-up.controller';
import { FecthNearbyOrdersDoneController } from './controllers/fetch-nearby-orders-done.controller';
import { FecthRecipientEmailsBySearchController } from './controllers/fetch-recipient-emails-by-search.controller';
import { GetOrderDetailsController } from './controllers/get-order-details.controller';
import { GetOrderByTrackingCodeController } from './controllers/get-order-by-tracking-code.controller';
import { GetRecipientByEmailController } from './controllers/get-recipient-by-email.controller';
import { GetDeliverymanByIdController } from './controllers/get-deliveryman-by-id.controller';

import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { RegisterDeliverymanUseCase } from '@/domain/delivery/application/use-cases/register-deliveryman';
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';
import { AuthenticateDeliverymenUseCase } from '@/domain/delivery/application/use-cases/authenticate-deliveryman';
import { EditOrderStatusToPicknUpUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-pickn-up';
import { EditOrderStatusToDoneUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-done';
import { EditOrderStatusToReturnUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-return';
import { UploadAndCreateAttachmentUseCase } from '@/domain/delivery/application/use-cases/upload-and-create-attachment';
import { FetchNearbyOrdersWaitingAndPicknUpUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-waiting-and-pickn-up';
import { FetchNearbyOrdersDoneUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-done';
import { FetchRecipientEmailsBySearchUseCase } from '@/domain/delivery/application/use-cases/fetch-recipient-emails-by-search';
import { GetOrderDetailsUseCase } from '@/domain/delivery/application/use-cases/get-order-details';
import { GetOrderByTrackingCodeUseCase } from '@/domain/delivery/application/use-cases/get-order-by-tracking-code';
import { GetRecipientByEmailUseCase } from '@/domain/delivery/application/use-cases/get-recipient-by-email';
import { GetDeliverymanByIdUseCase } from '@/domain/delivery/application/use-cases/get-deliveryman-by-id';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    CreateOrderController,
    RegisterDeliveryManController,
    RegisterRecipientController,
    AuthenticateAccountController,
    AuthenticateDeliverymanController,
    EditOrderStatusToPicknUpController,
    EditOrderStatusToDoneController,
    EditOrderStatusToReturnController,
    UploadAndCreateAttachmentController,
    FecthNearbyOrdersWaitingAndPicknUpController,
    FecthNearbyOrdersDoneController,
    FecthRecipientEmailsBySearchController,
    GetOrderDetailsController,
    GetOrderByTrackingCodeController,
    GetRecipientByEmailController,
    GetDeliverymanByIdController,
  ],
  providers: [
    RegisterAdminUseCase,
    CreateOrderUseCase,
    RegisterDeliverymanUseCase,
    RegisterRecipientUseCase,
    AuthenticateAdminUseCase,
    AuthenticateDeliverymenUseCase,
    EditOrderStatusToPicknUpUseCase,
    EditOrderStatusToDoneUseCase,
    EditOrderStatusToReturnUseCase,
    UploadAndCreateAttachmentUseCase,
    FetchNearbyOrdersWaitingAndPicknUpUseCase,
    FetchNearbyOrdersDoneUseCase,
    FetchRecipientEmailsBySearchUseCase,
    GetOrderDetailsUseCase,
    GetOrderByTrackingCodeUseCase,
    GetRecipientByEmailUseCase,
    GetDeliverymanByIdUseCase,
  ],
})
export class HttpModule {}
