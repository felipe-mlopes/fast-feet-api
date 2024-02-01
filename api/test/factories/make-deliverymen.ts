import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  DeliveryManUser,
  DeliveryManUserProps,
} from '@/domain/delivery/enterprise/entities/deliveryman-user';

export function makeDeliverymen(
  override: Partial<DeliveryManUserProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = DeliveryManUser.create(
    {
      deliveryManId: new UniqueEntityID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric(11),
      password: faker.lorem.sentence(),
      ...override,
    },
    id,
  );

  return deliveryman;
}
