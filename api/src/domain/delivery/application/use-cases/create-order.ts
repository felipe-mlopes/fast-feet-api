import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders-repository';
import { RecipentsRepository } from '../repositories/recipients-repository';

import { Order, Role } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface CreateOrderUseCaseRequest {
  adminRole: string;
  recipientId: string;
  title: string;
}

type CreateOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipentsRepository,
  ) {}

  async execute({
    adminRole,
    recipientId,
    title,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (adminRole !== Role.ADMIN) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    const order = Order.create({
      recipientId: recipient.id,
      recipientName: recipient.name,
      city: recipient.city,
      neighborhood: recipient.neighborhood,
      title,
    });

    recipient.orderIds.push(order.id.toString());

    await this.recipientsRepository.save(recipient);

    await this.ordersRepository.create(order);

    return right({
      order,
    });
  }
}
