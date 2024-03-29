import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';

import { Order } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface GetOrderDetailsUseCaseRequest {
  orderId: string;
}

type GetOrderDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class GetOrderDetailsUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: GetOrderDetailsUseCaseRequest): Promise<GetOrderDetailsUseCaseResponse> {
    const order = await this.ordersRepository.findDetailsById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    return right({
      order,
    });
  }
}
