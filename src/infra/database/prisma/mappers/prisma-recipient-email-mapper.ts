import { Shipping } from '@prisma/client';

import { RecipientEmail } from '@/domain/delivery/enterprise/entities/value-objects/recipient-email';

export class PrismaRecipientEmailMapper {
  static toDomain({ clientEmail }: Shipping): RecipientEmail {
    return RecipientEmail.create({
      email: clientEmail,
    });
  }
}
