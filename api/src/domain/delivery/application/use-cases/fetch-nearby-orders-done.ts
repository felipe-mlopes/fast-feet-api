import { OrdersRepository } from '../repositories/orders-repository';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface FetchNearbyOrdersDoneUseCaseRequest {
  deliverymanId: string;
  status: Status;
  city: string;
  page: number;
}

type FetchNearbyOrdersDoneUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchNearbyOrdersDoneUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    deliverymanId,
    status,
    city,
    page,
  }: FetchNearbyOrdersDoneUseCaseRequest): Promise<FetchNearbyOrdersDoneUseCaseResponse> {
    const deliveryman =
      await this.deliverymenRepository.findById(deliverymanId);

    if (!deliveryman) {
      return left(new NotAllowedError());
    }

    if (status !== Status.DONE) {
      return left(new ResourceNotFoundError());
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
