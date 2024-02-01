import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { DeliveryMenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository';
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper';
import { DeliveryManUser } from '@/domain/delivery/enterprise/entities/deliveryman-user';

@Injectable()
export class PrismaDeliverymenRepository implements DeliveryMenRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<DeliveryManUser | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!deliveryman) {
      return null;
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman);
  }

  async findByCPF(cpf: string) {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (!deliveryman) {
      return null;
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman);
  }

  async findByEmail(email: string) {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!deliveryman) {
      return null;
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman);
  }

  async create(deliveryman: DeliveryManUser) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman);

    await this.prisma.user.create({
      data,
    });
  }

  async save(deliveryman: DeliveryManUser) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman);

    await this.prisma.user.update({
      where: {
        id: deliveryman.id.toString(),
      },
      data,
    });
  }
}
