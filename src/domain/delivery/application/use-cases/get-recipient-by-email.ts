import { Injectable } from '@nestjs/common';

import { RecipentsRepository } from '../repositories/recipients-repository';

import { Recipient } from '../../enterprise/entities/recipient';
import { Role } from '../../enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface GetRecipientByEmailRequest {
  recipientEmail: string;
  adminRole: string;
}

type GetRecipientByEmailResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class GetRecipientByEmailUseCase {
  constructor(private recipientsRepository: RecipentsRepository) {}

  async execute({
    recipientEmail,
    adminRole,
  }: GetRecipientByEmailRequest): Promise<GetRecipientByEmailResponse> {
    if (adminRole !== Role.ADMIN) {
      return left(new NotAllowedError());
    }

    const recipient =
      await this.recipientsRepository.findByEmail(recipientEmail);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    return right({
      recipient,
    });
  }
}
