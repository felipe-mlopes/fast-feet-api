import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface EditOrderStatusToReturnUseCaseRequest {
  orderId: string;
  deliverymanId: string;
}

type EditOrderStatusToReturnUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

@Injectable()
export class EditOrderStatusToReturnUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliveryMenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    orderId,
    deliverymanId,
  }: EditOrderStatusToReturnUseCaseRequest): Promise<EditOrderStatusToReturnUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (order.status !== Status.PICKN_UP) {
      return left(new NotAllowedError());
    }

    const deliveryman =
      await this.deliveryMenRepository.findById(deliverymanId);

    if (!deliveryman) {
      return left(new NotAllowedError());
    }

    order.status = Status.WAITING;
    order.isReturned = true;

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
