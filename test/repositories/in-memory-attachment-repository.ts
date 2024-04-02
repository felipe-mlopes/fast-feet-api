import { AttachmentRepository } from '@/domain/delivery/application/repositories/attachment-repository';
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment';

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = [];

  async findByOrderId(orderId: string) {
    const attachment = this.items.find(
      (item) => item.orderId.toString() === orderId,
    );

    if (!attachment) {
      return null;
    }

    return attachment;
  }

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
