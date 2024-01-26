import { DeliveryMenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository';
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman';

export class InMemoryDeliveryMenRepository implements DeliveryMenRepository {
  public items: DeliveryMan[] = [];

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryman = this.items.find((item) => item.id.toString() === id);

    if (!deliveryman) {
      return null;
    }

    return deliveryman;
  }

  async findByCPF(cpf: number): Promise<DeliveryMan | null> {
    const deliveryman = this.items.find((item) => item.cpf === cpf);

    if (!deliveryman) {
      return null;
    }

    return deliveryman;
  }

  async create(deliveryman: DeliveryMan): Promise<void> {
    this.items.push(deliveryman);
  }

  async save(deliveryman: DeliveryMan): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryman.id,
    );

    this.items[itemIndex] = deliveryman;
  }
}
