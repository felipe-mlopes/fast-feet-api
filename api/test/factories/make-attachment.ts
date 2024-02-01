import { faker } from '@faker-js/faker';

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
