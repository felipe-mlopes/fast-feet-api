import { EditOrderStatusToReturnUseCase } from './edit-order-status-to-return';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { makeOrder } from 'test/factories/make-orders';
import { makeDeliverymen } from 'test/factories/make-deliverymen';

import { Status } from '@/domain/delivery/enterprise/entities/order';

import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository;
let sut: EditOrderStatusToReturnUseCase;

describe('Edit Order Status to Returned', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository();
    sut = new EditOrderStatusToReturnUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
    );
  });

  it('should be able to edit order status to return', async () => {
    const order = makeOrder();
    await inMemoryOrdersRepository.create(order);

    const deliveryman = makeDeliverymen();
    await inMemoryDeliveryMenRepository.create(deliveryman);

    order.deliverymanId = deliveryman.id;
    order.status = Status.PICKN_UP;

    await inMemoryOrdersRepository.save(order);

    await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    });

    expect(inMemoryOrdersRepository.items[0].status).toEqual(Status.WAITING);
    expect(inMemoryOrdersRepository.items[0].isReturned).toEqual(true);
  });

  it('should not be able to edit order status alreadry done', async () => {
    const order = makeOrder();
    await inMemoryOrdersRepository.create(order);

    const deliveryman = makeDeliverymen();
    await inMemoryDeliveryMenRepository.create(deliveryman);

    order.deliverymanId = deliveryman.id;
    order.status = Status.DONE;

    await inMemoryOrdersRepository.save(order);

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to return an order before it is pick'n up", async () => {
    const order = makeOrder();
    await inMemoryOrdersRepository.create(order);

    const deliveryman = makeDeliverymen();
    await inMemoryDeliveryMenRepository.create(deliveryman);

    const result = await sut.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
