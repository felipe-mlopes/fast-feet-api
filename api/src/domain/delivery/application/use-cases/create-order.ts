import { OrdersRepository } from '../repositories/orders-repository';
import { RecipentsRepository } from '../repositories/recipients-repository';

import { Order, Role } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin-repository';

interface CreateOrderUseCaseRequest {
  adminId: string;
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
    private adminRepository: AdminRepository,
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipentsRepository,
  ) {}

  async execute({
    adminId,
    recipientId,
    title,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    if (admin?.role !== Role.ADMIN) {
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
