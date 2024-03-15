import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id,
      email: recipient.email,
      zipcode: recipient.zipcode,
      address: recipient.address,
      orders: recipient.orderIds.length,
    };
  }
}
