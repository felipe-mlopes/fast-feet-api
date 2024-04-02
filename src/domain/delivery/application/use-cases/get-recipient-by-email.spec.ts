import { GetRecipientByEmailUseCase } from './get-recipient-by-email';

import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

import { makeAdminUser } from 'test/factories/make-admin-user';
import { makeRecipient } from 'test/factories/make-recipient';

import { Role } from '../../enterprise/entities/order';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryAdminRepository: InMemoryAdminRepository;
let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: GetRecipientByEmailUseCase;

describe('Get Recipient by Email', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new GetRecipientByEmailUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to get a recipient by email', async () => {
    const admin = makeAdminUser();
    await inMemoryAdminRepository.create(admin);

    const recipient = makeRecipient({
      name: 'John Doe',
      email: 'john-doe@example.com',
    });
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientEmail: 'john-doe@example.com',
      adminRole: admin.role,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryRecipientsRepository.items[0].name).toBe('John Doe');
  });

  it('should not be able to get a recipient by wrong email', async () => {
    const admin = makeAdminUser();
    await inMemoryAdminRepository.create(admin);

    const recipient = makeRecipient();
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientEmail: 'john-doe@example.com',
      adminRole: admin.role,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to get a recipient by email without being admin', async () => {
    const recipient = makeRecipient({ email: 'john-doe@example.com' });
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientEmail: recipient.email,
      adminRole: Role.DELIVERYMAN,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
