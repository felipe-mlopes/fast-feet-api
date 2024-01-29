import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { AuthenticateAdminUseCase } from './authenticate-admin';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { Admin } from '../../enterprise/entities/admin';
import { Role } from '../../enterprise/entities/order';

let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateAdminUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a admin user', async () => {
    const admin = Admin.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
      role: Role.ADMIN,
    });

    inMemoryAdminRepository.create(admin);

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
