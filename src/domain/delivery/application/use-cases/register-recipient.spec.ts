import { RegisterRecipientUseCase } from './register-recipient';

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeAdminUser } from 'test/factories/make-admin-user';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: RegisterRecipientUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new RegisterRecipientUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientsRepository,
    );
  });

  it('should be able to register a new recipient', async () => {
    const admin = makeAdminUser();

    await inMemoryAdminRepository.create(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'John Doe',
      address: 'Somewhere st',
      city: 'Somewhere city',
      neighborhood: 'downtown',
      zipcode: 12345678,
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be possible to register a new recipient without being an administrator', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      address: 'Somewhere st',
      city: 'Somewhere city',
      neighborhood: 'downtown',
      zipcode: 12345678,
      adminId: 'user-01',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
