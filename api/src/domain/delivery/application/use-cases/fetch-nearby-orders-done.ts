import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';

import { Order } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

interface FetchNearbyOrdersDoneUseCaseRequest {
  city: string;
  page: number;
  deliverymanId: string;
}

type FetchNearbyOrdersDoneUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

@Injectable()
export class FetchNearbyOrdersDoneUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    city,
    page,
    deliverymanId,
  }: FetchNearbyOrdersDoneUseCaseRequest): Promise<FetchNearbyOrdersDoneUseCaseResponse> {
    const deliveryman =
      await this.deliverymenRepository.findById(deliverymanId);

    if (!deliveryman) {
      return left(new NotAllowedError());
    }

    const orders =
      await this.ordersRepository.findManyRecentByCityAndOrdersDone(
        city,
        deliverymanId,
        {
          page,
        },
      );

    if (!orders) {
      return left(new ResourceNotFoundError());
    }

    return right({
      orders,
    });
  }
}
