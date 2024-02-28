import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User, UserProps } from './user';
import { Optional } from '@/core/types/optional';
import { Role } from './order';

export interface DeliveryManUserProps extends UserProps {
  deliveryManId: UniqueEntityID;
}

export class DeliveryManUser extends User<DeliveryManUserProps> {
  get deliveryManId() {
    return this.props.deliveryManId;
  }

  static create(
    props: Optional<DeliveryManUserProps, 'createdAt' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const deliveryManUser = new DeliveryManUser(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: Role.DELIVERYMAN,
      },
      id,
    );

    return deliveryManUser;
  }
}
