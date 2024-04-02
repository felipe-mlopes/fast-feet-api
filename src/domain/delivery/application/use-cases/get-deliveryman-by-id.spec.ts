import { GetDeliverymanByIdUseCase } from './get-deliveryman-by-id';

import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { makeDeliverymen } from 'test/factories/make-deliverymen';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryDeliverymenRepository: InMemoryDeliveryMenRepository;
let sut: GetDeliverymanByIdUseCase;

describe('Get Order by Tracking Code', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliveryMenRepository();
    sut = new GetDeliverymanByIdUseCase(inMemoryDeliverymenRepository);
  });

  it('should be able to get a order by tracking code', async () => {
    const deliveryman = makeDeliverymen({
      name: 'John Doe',
    });
    await inMemoryDeliverymenRepository.create(deliveryman);

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeliverymenRepository.items[0].name).toBe('John Doe');
  });

  it('should not be able to get a order by the missing tracking code', async () => {
    const deliveryman = makeDeliverymen();
    await inMemoryDeliverymenRepository.create(deliveryman);

    const result = await sut.execute({
      deliverymanId: 'deliveryman-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
