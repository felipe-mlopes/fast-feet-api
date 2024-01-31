import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper';

import { DeliveryMenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository';
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman';

@Injectable()
export class PrismaDeliverymenRepository implements DeliveryMenRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<DeliveryMan | null> {
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

  async findByCPF(cpf: number): Promise<DeliveryMan | null> {
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

  async create(deliveryman: DeliveryMan): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman);

    await this.prisma.user.create({
      data,
    });
  }

  async save(deliveryman: DeliveryMan): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman);

    await this.prisma.user.update({
      where: {
        id: deliveryman.id.toString(),
      },
      data,
    });
  }
}
