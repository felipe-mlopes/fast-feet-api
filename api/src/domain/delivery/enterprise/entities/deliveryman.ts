import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface DeliveryManProps {
  name: string;
  cpf: number;
  email: string;
  password: string;
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    const deliveryMan = new DeliveryMan(props, id);

    return deliveryMan;
  }
}
