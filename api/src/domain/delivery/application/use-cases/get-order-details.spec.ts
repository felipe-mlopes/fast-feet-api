import { GetOrderDetailsUseCase } from './get-order-details';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

import { makeOrder } from 'test/factories/makeOrders';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: GetOrderDetailsUseCase;

describe('Get Order Details', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new GetOrderDetailsUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should be able to get order details', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      zipcode: '12345678',
      address: 'Somewhere St',
      city: 'Somewhere City',
      neighborhood: 'Downtown',
    });

    await inMemoryRecipientsRepository.create(recipient);

    const order = makeOrder({
      recipientId: recipient.id,
    });

    await inMemoryOrdersRepository.create(order);

    recipient.orderIds.push(order.id.toString());

    await inMemoryRecipientsRepository.save(recipient);

    const result = await sut.execute({
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.recipient.name).toEqual('John Doe');
      expect(result.value.order.status).toEqual('waiting');
    }
  });

  it('should not be able to get order details when order id invalid', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      zipcode: '12345678',
      address: 'Somewhere St',
      city: 'Somewhere City',
      neighborhood: 'Downtown',
    });

    await inMemoryRecipientsRepository.create(recipient);

    const order = makeOrder({
      recipientId: recipient.id,
    });

    await inMemoryOrdersRepository.create(order);

    recipient.orderIds.push(order.id.toString());

    await inMemoryRecipientsRepository.save(recipient);

    const result = await sut.execute({
      orderId: new UniqueEntityID().toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to get order details when an order id not belong to the recipient', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      zipcode: '12345678',
      address: 'Somewhere St',
      city: 'Somewhere City',
      neighborhood: 'Downtown',
    });

    await inMemoryRecipientsRepository.create(recipient);

    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    recipient.orderIds.push(new UniqueEntityID().toString());

    await inMemoryRecipientsRepository.save(recipient);

    const result = await sut.execute({
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
