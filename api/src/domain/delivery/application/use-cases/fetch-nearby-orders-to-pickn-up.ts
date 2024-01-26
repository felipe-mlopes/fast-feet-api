import { OrdersRepository } from '../repositories/orders-repository';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface FetchNearbyOrdersToPicknUpUseCaseRequest {
  city: string;
  neighborhood: string;
  deliverymanId: string;
  page: number;
}

type FetchNearbyOrdersToPicknUpUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchNearbyOrdersToPicknUpUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymenRepository: DeliveryMenRepository,
  ) {}

  async execute({
    city,
    neighborhood,
    deliverymanId,
    page,
  }: FetchNearbyOrdersToPicknUpUseCaseRequest): Promise<FetchNearbyOrdersToPicknUpUseCaseResponse> {
    const deliveryman =
      await this.deliverymenRepository.findById(deliverymanId);

    if (!deliveryman) {
      return left(new NotAllowedError());
    }

    const status = Status.PICKN_UP;

    if (!status) {
      return left(new ResourceNotFoundError());
    }

    const orders = await this.ordersRepository.findManyRecentNearby(
      status,
      city,
      neighborhood,
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
