import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  Attachment,
  AttachmentProps,
} from '@/domain/delivery/enterprise/entities/attachment';

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      orderId: new UniqueEntityID(),
      title: faker.word.sample().concat('.png'),
      url: faker.image.url(),
      ...override,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return attachment;
  }
}
