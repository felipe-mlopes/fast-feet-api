import { DeliveryMenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository';
import { DeliveryManUser } from '@/domain/delivery/enterprise/entities/deliveryman-user';

export class InMemoryDeliveryMenRepository implements DeliveryMenRepository {
  public items: DeliveryManUser[] = [];

  async findById(id: string): Promise<DeliveryManUser | null> {
    const deliveryman = this.items.find((item) => item.id.toString() === id);

    if (!deliveryman) {
      return null;
    }

    return deliveryman;
  }

  async findByCPF(cpf: string): Promise<DeliveryManUser | null> {
    const deliveryman = this.items.find((item) => item.cpf === cpf);

    if (!deliveryman) {
      return null;
    }

    return deliveryman;
  }

  async findByEmail(email: string): Promise<DeliveryManUser | null> {
    const deliveryman = this.items.find((item) => item.email === email);

    if (!deliveryman) {
      return null;
    }

    return deliveryman;
  }

  async create(deliveryman: DeliveryManUser): Promise<void> {
    this.items.push(deliveryman);
  }

  async save(deliveryman: DeliveryManUser): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryman.id,
    );

    this.items[itemIndex] = deliveryman;
  }
}
