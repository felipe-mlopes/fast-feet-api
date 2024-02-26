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
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryDeliverymenRepository.create(deliveryman);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
