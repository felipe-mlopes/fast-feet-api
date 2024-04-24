import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { RecipientEmail } from '../../enterprise/entities/value-objects/recipient-email';

export abstract class RecipentsRepository {
  abstract findById(id: string): Promise<Recipient | null>;
  abstract findByOrderId(orderId: string): Promise<Recipient | null>;
  abstract findByEmail(email: string): Promise<Recipient | null>;
  abstract findManyRecipientEmailBySearch(
    search: string,
  ): Promise<RecipientEmail[] | null>;
  abstract create(recipient: Recipient): Promise<void>;
  abstract save(recipient: Recipient): Promise<void>;
}
