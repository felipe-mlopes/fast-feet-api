import { RegisterRecipientUseCase } from './register-recipient';

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

import { Role } from '@/domain/delivery/enterprise/entities/order';

import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: RegisterRecipientUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new RegisterRecipientUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to register a new recipient', async () => {
    const role = Role.ADMIN;

    const result = await sut.execute({
      role,
      name: 'John Doe',
      address: 'Somewhere st',
      city: 'Somewhere city',
      neighborhood: 'downtown',
      zipcode: 12345678,
    });

    expect(result.isRight()).toBe(true);
  });

  it('should not be possible to register a new recipient without being an administrator', async () => {
    const role = Role.USER;

    const result = await sut.execute({
      role,
      name: 'John Doe',
      address: 'Somewhere st',
      city: 'Somewhere city',
      neighborhood: 'downtown',
      zipcode: 12345678,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
