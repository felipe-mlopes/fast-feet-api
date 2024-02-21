import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaDeliverymanMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  DeliveryManUser,
  DeliveryManUserProps,
} from '@/domain/delivery/enterprise/entities/deliveryman-user';

export function makeDeliverymen(
  override: Partial<DeliveryManUserProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = DeliveryManUser.create(
    {
      deliveryManId: new UniqueEntityID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric(11),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return deliveryman;
}

@Injectable()
export class DeliverymenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(
    data: Partial<DeliveryManUserProps> = {},
  ): Promise<DeliveryManUser> {
    const deliveryman = makeDeliverymen(data);

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    });

    return deliveryman;
  }
}
