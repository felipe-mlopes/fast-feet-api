import { OrdersRepository } from '../repositories/orders-repository';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

import { Order } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface FetchNearbyOrdersWaitingAndPicknUpUseCaseRequest {
  deliverymanId: string;
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
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    deliverymanId,
    city,
    page,
  }: FetchNearbyOrdersWaitingAndPicknUpUseCaseRequest): Promise<FetchNearbyOrdersWaitingAndPicknUpUseCaseResponse> {
    const deliveryman =
      await this.deliverymenRepository.findById(deliverymanId);

    if (!deliveryman) {
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
