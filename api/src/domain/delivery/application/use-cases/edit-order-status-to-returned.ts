import { OrdersRepository } from '../repositories/orders-repository';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface EditOrderStatusToReturnedUseCaseRequest {
  orderId: string;
  deliverymanId: string;
}

type EditOrderStatusToReturnedUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

export class EditOrderStatusToReturnedUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    orderId,
    deliverymanId,
  }: EditOrderStatusToReturnedUseCaseRequest): Promise<EditOrderStatusToReturnedUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    const deliveryman =
      await this.deliveryMenRepository.findById(deliverymanId);

    if (!deliveryman) {
      return left(new NotAllowedError());
    }

    if (order.status !== Status.PICKN_UP) {
      return left(new NotAllowedError());
    }

    order.status = Status.WAITING;

    return right({
      order,
    });
  }
}
