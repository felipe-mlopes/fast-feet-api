import { OrdersRepository } from '../repositories/orders-repository';

import { Order, Role } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface FetchNearbyOrdersWaitingAndPicknUpUseCaseRequest {
  deliverymanRole: Role.DELIVERYMAN;
  city: string;
  page: number;
}

type FetchNearbyOrdersWaitingAndPicknUpUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchNearbyOrdersWaitingAndPicknUpUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    city,
    page,
    deliverymanRole,
  }: FetchNearbyOrdersWaitingAndPicknUpUseCaseRequest): Promise<FetchNearbyOrdersWaitingAndPicknUpUseCaseResponse> {
    if (deliverymanRole !== Role.DELIVERYMAN) {
      return left(new NotAllowedError());
    }

    const orders =
      await this.ordersRepository.findManyRecentByCityAndOrdersWaitingAndPicknUp(
        city,
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
