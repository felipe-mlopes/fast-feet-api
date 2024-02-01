import { Prisma, User as PrismaUser } from '@prisma/client';

import { DeliveryManUser } from '@/domain/delivery/enterprise/entities/deliveryman-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): DeliveryManUser {
    return DeliveryManUser.create(
      {
        deliveryManId: new UniqueEntityID(raw.id),
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    deliveryman: DeliveryManUser,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      cpf: deliveryman.cpf,
      email: deliveryman.email,
      password: deliveryman.password,
      role: 'DELIVERYMAN',
    };
  }
}
