import { Injectable } from '@nestjs/common';

import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { RecipientEmail } from '@/domain/delivery/enterprise/entities/value-objects/recipient-email';

import { PrismaService } from '../prisma.service';

import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';
import { PrismaRecipientEmailMapper } from '../mappers/prisma-recipient-email-mapper';

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

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.shipping.findUnique({
      where: {
        clientEmail: email,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async findManyRecipientEmailBySearch(
    search: string,
  ): Promise<RecipientEmail[] | null> {
    const recipients = await this.prisma.shipping.findMany({
      where: {
        clientEmail: {
          contains: search,
          mode: 'insensitive',
        },
      },
      take: 5,
      orderBy: {
        clientEmail: 'asc',
      },
    });

    return recipients.map((recipient) =>
      PrismaRecipientEmailMapper.toDomain(recipient),
    );
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
