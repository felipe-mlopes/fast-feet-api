import { DeliveryManUser } from '@/domain/delivery/enterprise/entities/deliveryman-user';

export class DeliverymanPresenter {
  static toHTTP(deliveryman: DeliveryManUser) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      cpf: deliveryman.cpf,
      email: deliveryman.email,
    };
  }
}
