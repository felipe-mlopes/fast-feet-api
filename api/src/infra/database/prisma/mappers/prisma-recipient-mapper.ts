import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Shipping as PrismaShipping } from '@prisma/client';

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaShipping): Recipient {
    return Recipient.create(
      {
        name: raw.clientName,
        zipcode: raw.clientZipcode,
        address: raw.clientAddress,
        neighborhood: raw.clientNeighborhood,
        city: raw.clientCity,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
