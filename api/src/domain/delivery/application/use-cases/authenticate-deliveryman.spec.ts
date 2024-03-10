import { InMemoryDeliveryMenRepository } from 'test/repositories/in-memory-deliverymen-repository';

import { AuthenticateDeliverymenUseCase } from './authenticate-deliveryman';

import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeDeliverymen } from 'test/factories/make-deliverymen';

let inMemoryDeliverymenRepository: InMemoryDeliveryMenRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateDeliverymenUseCase;

describe('Authenticate Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliveryMenRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateDeliverymenUseCase(
      inMemoryDeliverymenRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a deliveryman', async () => {
    const deliveryman = makeDeliverymen({
      cpf: '789.456.123-00',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryDeliverymenRepository.create(deliveryman);

    const result = await sut.execute({
      cpf: '789.456.123-00',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
