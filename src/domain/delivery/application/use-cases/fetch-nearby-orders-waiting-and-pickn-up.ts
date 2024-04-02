import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';

import { OrderWithNeighborhood } from '../../enterprise/entities/value-objects/order-with-neighborhood';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

interface FetchNearbyOrdersWaitingAndPicknUpUseCaseRequest {
  city: string;
  page: number;
  deliverymanId: string;
}

type FetchNearbyOrdersWaitingAndPicknUpUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: OrderWithNeighborhood[];
  }
>;

@Injectable()
export class FetchNearbyOrdersWaitingAndPicknUpUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    city,
    page,
    deliverymanId,
  }: FetchNearbyOrdersWaitingAndPicknUpUseCaseRequest): Promise<FetchNearbyOrdersWaitingAndPicknUpUseCaseResponse> {
    const deliveryman =
      await this.deliverymenRepository.findById(deliverymanId);

    if (!deliveryman) {
      return left(new NotAllowedError());
    }

    const orders =
      await this.ordersRepository.findManyRecentByCityAndOrdersWaitingAndPicknUp(
        city,
        deliverymanId,
        { page },
      );

    if (!orders) {
      return left(new ResourceNotFoundError());
    }

    return right({
      orders,
    });
  }
}
