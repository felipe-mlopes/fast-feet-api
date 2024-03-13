import { Injectable } from '@nestjs/common';

import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { PrismaService } from '../prisma.service';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

@Injectable()
export class PrismaRecipientsRepository implements RecipentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const recipient = await this.prisma.shipping.findUnique({
      where: {
        id,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findByOrderId(orderId: string) {
    const recipient = await this.prisma.shipping.findFirst({
      where: {
        orders: {
          some: {
            id: orderId,
          },
        },
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async create(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.shipping.create({
      data,
    });
  }

  async save(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.shipping.update({
      where: {
        id: recipient.id.toString(),
      },
      data,
    });
  }
}
