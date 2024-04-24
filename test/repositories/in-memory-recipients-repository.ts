import { RecipentsRepository } from '@/domain/delivery/application/repositories/recipients-repository';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { RecipientEmail } from '@/domain/delivery/enterprise/entities/value-objects/recipient-email';

export class InMemoryRecipientsRepository implements RecipentsRepository {
  public items: Recipient[] = [];

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id);

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async findByOrderId(orderId: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) =>
      item.orderIds.includes(orderId),
    );

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.email === email);

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async findManyRecipientEmailBySearch(
    search: string,
  ): Promise<RecipientEmail[] | null> {
    const recipientEmails = this.items
      .filter((item) => item.email.includes(search))
      .map((item) => ({ email: item.email }));

    if (!recipientEmails) {
      return null;
    }

    return recipientEmails.map((recipient) =>
      RecipientEmail.create({
        email: recipient.email,
      }),
    );
  }

  async create(recipient: Recipient) {
    this.items.push(recipient);
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id);

    this.items[itemIndex] = recipient;
  }
}
