import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Order,
  OrderProps,
  Role,
  Status,
} from '@/domain/delivery/enterprise/entities/order';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      city: faker.location.city(),
      neighborhood: faker.location.county(),
      role: Role.ADMIN,
      deliverymanId: null,
      title: faker.lorem.sentence(),
      status: Status.WAITING,
      attachmentId: '',
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });

    return order;
  }
}
