import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  DeliveryMan,
  DeliveryManProps,
} from '@/domain/delivery/enterprise/entities/deliveryman';

export function makeDeliverymen(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = DeliveryMan.create(
    {
      name: faker.person.fullName(),
      cpf: faker.number.int({ max: 99999999999 }),
      password: faker.lorem.sentence(),
      ...override,
    },
    id,
  );

  return deliveryman;
}
