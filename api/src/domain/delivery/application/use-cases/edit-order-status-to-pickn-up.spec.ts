import { EditOrderStatusToPicknUpUseCase } from './edit-order-status-to-pickn-up';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { makeOrder } from 'test/factories/make-orders';

import { Status } from '@/domain/delivery/enterprise/entities/order';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeDeliverymen } from 'test/factories/make-deliverymen';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository;
let sut: EditOrderStatusToPicknUpUseCase;

describe("Edit Order Status to Pick'n Up", () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository();
    sut = new EditOrderStatusToPicknUpUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
    );
  });

  it("should be able to edit order status to pick'n up", async () => {
    const newOrder = makeOrder({
      title: 'New order',
    });

    await inMemoryOrdersRepository.create(newOrder);

    const deliveryman = makeDeliverymen();

    await inMemoryDeliveryMenRepository.create(deliveryman);

    const orderId = newOrder.id.toString();
    const deliverymanId = deliveryman.id.toString();

    await sut.execute({
      orderId,
      deliverymanId,
    });

    expect(inMemoryOrdersRepository.items[0].status).toEqual(Status.PICKN_UP);
    expect(inMemoryOrdersRepository.items[0].deliverymanId).toEqual(
      new UniqueEntityID(deliverymanId),
    );
    expect(inMemoryOrdersRepository.items[0].title).toEqual('New order');
  });

  it('should not be able to edit order status to done before the order is waiting', async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const newDeliverymanId = new UniqueEntityID('deliveryman-01');

    order.status = Status.PICKN_UP;
    order.deliverymanId = newDeliverymanId;

    const result = await sut.execute({
      deliverymanId: newDeliverymanId.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
