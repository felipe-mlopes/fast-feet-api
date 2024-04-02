import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

export abstract class RecipentsRepository {
  abstract findById(id: string): Promise<Recipient | null>;
  abstract findByOrderId(orderId: string): Promise<Recipient | null>;
  abstract findByEmail(email: string): Promise<Recipient | null>;
  abstract create(recipient: Recipient): Promise<void>;
  abstract save(recipient: Recipient): Promise<void>;
}
