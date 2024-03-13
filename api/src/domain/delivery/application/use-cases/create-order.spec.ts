import { CreateOrderUseCase } from './create-order';

import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

import { makeAdminUser } from 'test/factories/make-admin-user';

import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeDeliverymen } from 'test/factories/make-deliverymen';

let inMemoryAdminRepository: InMemoryAdminRepository;
let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should be able to create a new order', async () => {
    const admin = makeAdminUser();

    await inMemoryAdminRepository.create(admin);

    const recipient = Recipient.create({
      name: 'John Doe',
      zipcode: 12345678,
      address: 'Somewhere St',
      city: 'Somewhere city',
      neighborhood: 'downtown',
    });

    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      adminRole: admin.role,
      recipientId: recipient.id.toString(),
      title: 'Order 01',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    });
  });

  it('should not be possible to create an order without being an administrator', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      zipcode: 12345678,
      address: 'Somewhere St',
      city: 'Somewhere city',
      neighborhood: 'downtown',
    });

    await inMemoryRecipientsRepository.create(recipient);

    const user = makeDeliverymen();

    const result = await sut.execute({
      adminRole: user.role,
      recipientId: recipient.id.toString(),
      title: 'Order-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be possible to create an order without registered recipient', async () => {
    const id = new UniqueEntityID();

    const admin = makeAdminUser();

    await inMemoryAdminRepository.create(admin);

    const result = await sut.execute({
      adminRole: admin.role,
      recipientId: id.toString(),
      title: 'Order-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
