import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';

import { Order, Status } from '@/domain/delivery/enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface EditOrderStatusToPicknUpUseCaseRequest {
  orderId: string;
  deliverymanId: string;
}

type EditOrderStatusToPicknUpUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class EditOrderStatusToPicknUpUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    deliverymanId,
  }: EditOrderStatusToPicknUpUseCaseRequest): Promise<EditOrderStatusToPicknUpUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (order.status !== Status.WAITING) {
      return left(new NotAllowedError());
    }

    order.status = Status.PICKN_UP;
    order.deliverymanId = new UniqueEntityID(deliverymanId);

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
