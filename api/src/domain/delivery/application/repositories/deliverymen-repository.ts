import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman';

export abstract class DeliveryMenRepository {
  abstract findById(id: string): Promise<DeliveryMan | null>;
  abstract findByCPF(cpf: number): Promise<DeliveryMan | null>;
  abstract create(deliveryman: DeliveryMan): Promise<void>;
  abstract save(deliveryman: DeliveryMan): Promise<void>;
}
