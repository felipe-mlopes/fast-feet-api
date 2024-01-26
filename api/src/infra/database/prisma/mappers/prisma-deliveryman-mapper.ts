import { Prisma, User as PrismaUser } from '@prisma/client';
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): DeliveryMan {
    return DeliveryMan.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(deliveryman: DeliveryMan): Prisma.UserUncheckedCreateInput {
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
