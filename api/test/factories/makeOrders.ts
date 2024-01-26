import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Order,
  OrderProps,
  Role,
  Status,
} from '@/domain/delivery/enterprise/entities/order';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      city: faker.location.city(),
      neighborhood: faker.location.county(),
      role: Role.ADMIN,
      deliverymanId: null,
      title: faker.lorem.sentence(),
      status: Status.WAITING,
      attachment: '',
      ...override,
    },
    id,
  );

  return order;
}
