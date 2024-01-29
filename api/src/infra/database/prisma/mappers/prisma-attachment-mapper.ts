import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment';
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        orderId: new UniqueEntityID(raw.orderId),
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      orderId: attachment.orderId.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
