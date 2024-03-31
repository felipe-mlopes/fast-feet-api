import { GetRecipientByEmailUseCase } from './get-recipient-by-email';

import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository';

import { makeRecipient } from 'test/factories/make-recipient';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryRecipientsRepository: InMemoryRecipientsRepository;
let sut: GetRecipientByEmailUseCase;

describe('Get Order by Tracking Code', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository();
    sut = new GetRecipientByEmailUseCase(inMemoryRecipientsRepository);
  });

  it('should be able to get a order by tracking code', async () => {
    const recipient = makeRecipient({
      name: 'John Doe',
      email: 'john-doe@example.com',
    });
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientEmail: 'john-doe@example.com',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryRecipientsRepository.items[0].name).toBe('John Doe');
  });

  it('should not be able to get a order by the missing tracking code', async () => {
    const recipient = makeRecipient();
    await inMemoryRecipientsRepository.create(recipient);

    const result = await sut.execute({
      recipientEmail: 'john-doe@example.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
