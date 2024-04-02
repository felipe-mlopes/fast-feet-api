import { Attachment } from '@/domain/delivery/enterprise/entities/attachment';

export abstract class AttachmentRepository {
  abstract findByOrderId(orderId: string): Promise<Attachment | null>;
  abstract create(attachment: Attachment): Promise<void>;
}
