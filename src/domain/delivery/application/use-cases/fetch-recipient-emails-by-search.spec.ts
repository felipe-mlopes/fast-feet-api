import { FetchRecipientEmailsBySearchUseCase } from './fetch-recipient-emails-by-search';

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

import { makeRecipient } from 'test/factories/make-recipient';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: FetchRecipientEmailsBySearchUseCase;

describe('Fetch Recipient Emails by Search', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();

    sut = new FetchRecipientEmailsBySearchUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to fetch recipient emails by search', async () => {
    const recipient01 = makeRecipient({ email: 'john-doe@test.com' });
    const recipient02 = makeRecipient({ email: 'john.doe@example.com' });
    const recipient03 = makeRecipient({ email: 'johndoe@exampletest.com' });

    await inMemoryRecipientsRepository.create(recipient01);
    await inMemoryRecipientsRepository.create(recipient02);
    await inMemoryRecipientsRepository.create(recipient03);

    const result = await sut.execute({
      adminRole: 'ADMIN',
      search: 'john',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.recipientEmails).toHaveLength(3);
    }
  });

  it('should not be able to fetch recipient emails by search without the admin user being logged in', async () => {
    const recipient = makeRecipient({ email: 'john-doe@test.com' });
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      adminRole: 'DELIVERYMAN',
      search: 'john',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be able to fetch recipient emails by search with less than three characters filled', async () => {
    const recipient = makeRecipient({ email: 'john-doe@test.com' });
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      adminRole: 'ADMIN',
      search: '',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
