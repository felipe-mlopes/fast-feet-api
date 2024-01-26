import { OrdersRepository } from '../repositories/orders-repository';
import { RecipentsRepository } from '../repositories/recipients-repository';

import { Order } from '@/domain/delivery/enterprise/entities/order';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface GetOrderDetailsUseCaseRequest {
  orderId: string;
}

type GetOrderDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
    recipient: Recipient;
  }
>;

export class GetOrderDetailsUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipentsRepository,
  ) {}

  async execute({
    orderId,
  }: GetOrderDetailsUseCaseRequest): Promise<GetOrderDetailsUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    const recipient = await this.recipientsRepository.findByOrderId(orderId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    return right({
      order,
      recipient,
    });
  }
}
