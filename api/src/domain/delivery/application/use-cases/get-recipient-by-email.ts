import { Injectable } from '@nestjs/common';

import { RecipentsRepository } from '../repositories/recipients-repository';

import { Recipient } from '../../enterprise/entities/recipient';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface GetRecipientByEmailRequest {
  recipientEmail: string;
}

type GetRecipientByEmailResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class GetRecipientByEmailUseCase {
  constructor(private recipientsRepository: RecipentsRepository) {}

  async execute({
    recipientEmail,
  }: GetRecipientByEmailRequest): Promise<GetRecipientByEmailResponse> {
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
