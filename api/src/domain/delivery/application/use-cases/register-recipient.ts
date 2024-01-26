import { RecipentsRepository } from '../repositories/recipients-repository';

import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Role } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface RegisterRecipientUseCaseRequest {
  role: Role;
  name: string;
  zipcode: string;
  address: string;
  city: string;
  neighborhood: string;
}

type RegisterRecipientUseCaseResponse = Either<
  NotAllowedError,
  {
    recipient: Recipient;
  }
>;

export class RegisterRecipientUseCase {
  constructor(private recipientRepository: RecipentsRepository) {}

  async execute({
    role,
    name,
    zipcode,
    address,
    city,
    neighborhood,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    if (role !== Role.ADMIN) {
      return left(new NotAllowedError());
    }

    const recipient = Recipient.create({
      name,
      address,
      zipcode,
      city,
      neighborhood,
    });

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
