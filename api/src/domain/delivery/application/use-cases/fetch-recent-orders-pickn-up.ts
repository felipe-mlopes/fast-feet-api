import { OrdersRepository } from '../repositories/orders-repository';

import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

import { Either, right } from '@/core/either';

interface FetchRecentOrdersPicknUpUseCaseRequest {
  deliverymanId: string;
  page: number;
}

type FetchRecentOrdersPicknUpUseCaseResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

export class FetchRecentOrdersPicknUpUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
    page,
  }: FetchRecentOrdersPicknUpUseCaseRequest): Promise<FetchRecentOrdersPicknUpUseCaseResponse> {
    const status = Status.PICKN_UP;
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
