import { CreateOrderUseCase } from './create-order';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

import { Role } from '@/domain/delivery/enterprise/entities/order';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should be able to create a new order', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      zipcode: 12345678,
      address: 'Somewhere St',
      city: 'Somewhere city',
      neighborhood: 'downtown',
    });

    await inMemoryRecipientsRepository.create(recipient);

    const role = Role.ADMIN;

    const result = await sut.execute({
      role,
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

    const role = Role.USER;

    const result = await sut.execute({
      role,
      recipientId: recipient.id.toString(),
      title: 'Order-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be possible to create an order without registered recipient', async () => {
    const id = new UniqueEntityID();
    const role = Role.ADMIN;

    const result = await sut.execute({
      role,
      recipientId: id.toString(),
      title: 'Order-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
