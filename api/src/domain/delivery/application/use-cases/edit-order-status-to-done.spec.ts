import { EditOrderStatusToDoneUseCase } from './edit-order-status-to-done';

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository';
import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository';

import { makeOrder } from 'test/factories/makeOrders';
import { makeDeliverymen } from 'test/factories/makeDeliverymen';
import { makeAttachment } from 'test/factories/makeAttachment';

import { Status } from '@/domain/delivery/enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryOrdersRepository: InMemoryOrdersRepository;
let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository;
let inMemoryAttachmentRespository: InMemoryAttachmentRepository;
let sut: EditOrderStatusToDoneUseCase;

describe('Edit Order Status to Done', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository();
    inMemoryAttachmentRespository = new InMemoryAttachmentRepository();
    sut = new EditOrderStatusToDoneUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryMenRepository,
      inMemoryAttachmentRespository,
    );
  });

  it('should be able to edit order status to done', async () => {
    const order = makeOrder({
      title: 'New order',
    });

    await inMemoryOrdersRepository.create(order);

    const newDeliveryman = makeDeliverymen();

    await inMemoryDeliveryMenRepository.create(newDeliveryman);

    const attachment = makeAttachment({ orderId: order.id });

    inMemoryAttachmentRespository.items.push(attachment);

    order.status = Status.PICKN_UP;
    order.deliverymanId = newDeliveryman.id;
    order.attachment = attachment.id.toString();

    await inMemoryOrdersRepository.save(order);

    await sut.execute({
      deliverymanId: newDeliveryman.id.toString(),
      orderId: order.id.toString(),
    });

    expect(inMemoryOrdersRepository.items[0].status).toEqual(Status.DONE);
    expect(inMemoryOrdersRepository.items[0].deliverymanId).toEqual(
      newDeliveryman.id,
    );
    expect(inMemoryOrdersRepository.items[0].title).toEqual('New order');
    expect(inMemoryOrdersRepository.items[0].attachment).toEqual(
      attachment.id.toString(),
    );
  });

  it('should not be able to edit order status from another user', async () => {
    const order = makeOrder(
      {
        deliverymanId: new UniqueEntityID('deliveryman-01'),
      },
      new UniqueEntityID('order-01'),
    );

    await inMemoryOrdersRepository.create(order);

    const newDeliveryman = makeDeliverymen();

    await inMemoryDeliveryMenRepository.create(newDeliveryman);

    const attachment = makeAttachment({ orderId: order.id });

    inMemoryAttachmentRespository.items.push(attachment);

    order.attachment = attachment.id.toString();

    const result = await sut.execute({
      deliverymanId: newDeliveryman.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to edit order status to done before the order is pick'n up", async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const newDeliveryman = makeDeliverymen();

    await inMemoryDeliveryMenRepository.create(newDeliveryman);

    const attachment = makeAttachment({ orderId: order.id });

    inMemoryAttachmentRespository.items.push(attachment);

    order.attachment = attachment.id.toString();

    const result = await sut.execute({
      deliverymanId: newDeliveryman.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit order status to done before to send an attachment', async () => {
    const order = makeOrder();

    await inMemoryOrdersRepository.create(order);

    const newDeliveryman = makeDeliverymen();

    await inMemoryDeliveryMenRepository.create(newDeliveryman);

    order.status = Status.PICKN_UP;
    order.deliverymanId = newDeliveryman.id;

    await inMemoryOrdersRepository.save(order);

    const result = await sut.execute({
      deliverymanId: newDeliveryman.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
