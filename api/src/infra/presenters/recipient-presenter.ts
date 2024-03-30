import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      zipcode: recipient.zipcode,
      address: recipient.address,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
    };
  }
}
