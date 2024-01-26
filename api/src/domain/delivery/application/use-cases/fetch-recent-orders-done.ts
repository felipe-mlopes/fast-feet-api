import { OrdersRepository } from '../repositories/orders-repository';

import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

import { Either, right } from '@/core/either';

interface FetchRecentOrdersDoneUseCaseRequest {
  deliverymanId: string;
  page: number;
}

type FetchRecentOrdersDoneUseCaseResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

export class FetchRecentOrdersDoneUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
    page,
  }: FetchRecentOrdersDoneUseCaseRequest): Promise<FetchRecentOrdersDoneUseCaseResponse> {
    const status = Status.DONE;
    const orders = await this.ordersRepository.findManyRecentByStatus(
      status,
      deliverymanId,
      { page },
    );

    return right({
      orders,
    });
  }
}
