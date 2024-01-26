import { RegisterDeliverymanUseCase } from './register-deliveryman';

import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { FakeHasher } from 'test/cryptography/fake-hasher';

import { DeliveryManAlreadyExistsError } from './errors/deliveryman-already-exists-error';

let inMemoryDeliveryMenRepository: InMemoryDeliveryMenRepository;
let fakeHasher: FakeHasher;
let sut: RegisterDeliverymanUseCase;

describe('Register Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliveryMenRepository = new InMemoryDeliveryMenRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterDeliverymanUseCase(
      inMemoryDeliveryMenRepository,
      fakeHasher,
    );
  });

  it('should be able to register a new deliveryman', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: 99999999999,
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliveryMenRepository.items[0],
    });
  });

  it('should hash deliveryman password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: 99999999999,
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeliveryMenRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });

  it('should not be able to register a new deliveryman with CPF exists', async () => {
    await sut.execute({
      name: 'John Doe',
      cpf: 99999999999,
      password: '123456',
    });

    const result = await sut.execute({
      name: 'Max',
      cpf: 99999999999,
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DeliveryManAlreadyExistsError);
  });
});
