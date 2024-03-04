import { AttachmentRepository } from '@/domain/delivery/application/repositories/attachment-repository';
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async findByOrderId(orderId: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: {
        orderId,
      },
    });

    if (!attachment) {
      return null;
    }

    return PrismaAttachmentMapper.toDomain(attachment);
  }

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }
}
