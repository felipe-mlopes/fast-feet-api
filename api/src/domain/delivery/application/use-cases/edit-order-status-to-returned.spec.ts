import { EditOrderStatusToReturnedUseCase } from './edit-order-status-to-returned';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { makeOrder } from 'test/factories/make-orders';

import { Status } from '@/domain/delivery/enterprise/entities/order';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository;
let sut: EditOrderStatusToReturnedUseCase;

describe('Edit Order Status to Returned', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository();
    sut = new EditOrderStatusToReturnedUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
    );
  });

  it('should be able to edit order status to returned', async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const newDeliverymanId = new UniqueEntityID();

    await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: newDeliverymanId.toString(),
    });

    expect(inMemoryOrdersRepository.items[0].status).toEqual(Status.WAITING);
  });

  it("should not be able to edit order status to done before the order is pick'n up", async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const newDeliverymanId = new UniqueEntityID();

    order.deliverymanId = newDeliverymanId;
    order.status = Status.DONE;

    await inMemoryOrdersRepository.save(order);

    const result = await sut.execute({
      deliverymanId: newDeliverymanId.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
