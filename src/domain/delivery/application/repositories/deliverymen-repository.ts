import { DeliveryManUser } from '../../enterprise/entities/deliveryman-user';

export abstract class DeliveryMenRepository {
  abstract findById(id: string): Promise<DeliveryManUser | null>;
  abstract findByCPF(cpf: string): Promise<DeliveryManUser | null>;
  abstract findByEmail(email: string): Promise<DeliveryManUser | null>;
  abstract create(deliveryman: DeliveryManUser): Promise<void>;
  abstract save(deliveryman: DeliveryManUser): Promise<void>;
}
