import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient';

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      zipcode: parseInt(faker.location.zipCode('########')),
      address: faker.location.streetAddress(),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      ...override,
    },
    id,
  );

  return recipient;
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data);

    await this.prisma.shipping.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });

    return recipient;
  }
}
