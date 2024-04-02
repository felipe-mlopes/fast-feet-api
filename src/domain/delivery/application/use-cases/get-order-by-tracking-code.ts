import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';

import { Order } from '../../enterprise/entities/order';

import { Either, right } from '@/core/either';

interface GetOrderByTrackingCodeUseCaseRequest {
  trackingCode: string;
}

type GetOrderByTrackingCodeUseCaseResponse = Either<
  null,
  {
    order: Order | null;
  }
>;

@Injectable()
export class GetOrderByTrackingCodeUseCase {
  constructor(private orderRepository: OrdersRepository) {}

  async execute({
    trackingCode,
  }: GetOrderByTrackingCodeUseCaseRequest): Promise<GetOrderByTrackingCodeUseCaseResponse> {
    const order = await this.orderRepository.findByTrackingCode(trackingCode);

    return right({
      order,
    });
  }
}
