import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { RegisterAdminUseCase } from './register-admin';

let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: RegisterAdminUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new RegisterAdminUseCase(inMemoryAdminRepository);
  });

  it('should be able to register a admin user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
  });
});
