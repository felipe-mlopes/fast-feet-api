import {
  Order as PrismaOrder,
  Shipping as PrismaShipping,
  Attachment as PrismaAttachment,
} from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-objects/order-details';

type PrismaOrderDetails = PrismaOrder & {
  recipient: PrismaShipping;
  attachment: PrismaAttachment;
};

export class PrismaOrderDetailsMapper {
  static toDomain(raw: PrismaOrderDetails): OrderDetails {
    return OrderDetails.create({
      orderId: new UniqueEntityID(raw.id),
      trackingCode: raw.trackingCode,
      title: raw.title,
      status: raw.status,
      isReturned: raw.isReturned,
      recipientId: new UniqueEntityID(raw.clientId),
      recipientName: raw.recipient.clientName,
      recipientAddress: raw.recipient.clientAddress,
      recipientZipcode: raw.recipient.clientZipcode,
      recipientState: raw.recipient.clientState,
      recipientCity: raw.recipient.clientCity,
      recipientNeighborhood: raw.recipient.clientNeighborhood,
      createdAt: raw.createdAt,
      deliverymanId: raw.deliverymanId
        ? new UniqueEntityID(raw.deliverymanId)
        : null,
      attachmentId: raw.attachment.id ?? null,
      updatedAt: raw.updatedAt,
      picknUpAt: raw.picknUpAt,
      deliveryAt: raw.deliveryAt,
    });
  }
}
