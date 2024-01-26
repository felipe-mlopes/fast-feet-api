import { OrdersRepository } from '../repositories/orders-repository';
import { RecipentsRepository } from '../repositories/recipients-repository';

import { Order, Role } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface CreateOrderUseCaseRequest {
  role: Role;
  recipientId: string;
  title: string;
}

type CreateOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order;
  }
>;

export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipentsRepository,
  ) {}

  async execute({
    role,
    recipientId,
    title,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (role !== Role.ADMIN) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    const order = Order.create({
      role: Role.ADMIN,
      recipientId: recipient.id,
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
