import { Injectable } from '@nestjs/common';

import { RecipentsRepository } from '../repositories/recipients-repository';

import { Role } from '../../enterprise/entities/order';
import { RecipientEmail } from '../../enterprise/entities/value-objects/recipient-email';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface FetchRecipientEmailsBySearchUseCaseRequest {
  adminRole: string;
  search: string;
}

type FetchRecipientEmailsBySearchUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    recipientEmails: RecipientEmail[];
  }
>;

@Injectable()
export class FetchRecipientEmailsBySearchUseCase {
  constructor(private recipientsRepository: RecipentsRepository) {}

  async execute({
    adminRole,
    search,
  }: FetchRecipientEmailsBySearchUseCaseRequest): Promise<FetchRecipientEmailsBySearchUseCaseResponse> {
    if (adminRole !== Role.ADMIN) {
      return left(new NotAllowedError());
    }

    if (search.length < 3) {
      return left(new ResourceNotFoundError());
    }

    const recipientEmails =
      await this.recipientsRepository.findManyRecipientEmailBySearch(search);

    if (!recipientEmails) {
      return left(new ResourceNotFoundError());
    }

    return right({
      recipientEmails,
    });
  }
}
