import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';

import { Order, Role } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface FetchNearbyOrdersDoneUseCaseRequest {
  city: string;
  page: number;
  deliverymanRole: Role;
}

type FetchNearbyOrdersDoneUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

@Injectable()
export class FetchNearbyOrdersDoneUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    city,
    page,
    deliverymanRole,
  }: FetchNearbyOrdersDoneUseCaseRequest): Promise<FetchNearbyOrdersDoneUseCaseResponse> {
    if (deliverymanRole !== Role.DELIVERYMAN) {
      return left(new NotAllowedError());
    }

    const orders =
      await this.ordersRepository.findManyRecentByCityAndOrdersDone(city, {
        page,
      });

    if (!orders) {
      return left(new ResourceNotFoundError());
    }

    return right({
      orders,
    });
  }
}
