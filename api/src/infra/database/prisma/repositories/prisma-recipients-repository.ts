import { Injectable } from '@nestjs/common';

import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { PrismaService } from '../prisma.service';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';

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
        Order: {
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

  async create() {}

  async save() {}
}
