import { Injectable } from '@nestjs/common';

import { RecipentsRepository } from '../repositories/recipients-repository';

import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';
import { Role } from '@/domain/delivery/enterprise/entities/order';

import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';

interface RegisterRecipientUseCaseRequest {
  adminId: string;
  name: string;
  email: string;
  zipcode: number;
  address: string;
  neighborhood: string;
  city: string;
}

type RegisterRecipientUseCaseResponse = Either<
  NotAllowedError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class RegisterRecipientUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipentsRepository,
  ) {}

  async execute({
    adminId,
    name,
    email,
    zipcode,
    address,
    neighborhood,
    city,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    if (admin?.role !== Role.ADMIN) {
      return left(new NotAllowedError());
    }

    const recipient = Recipient.create({
      name,
      email,
      address,
      zipcode,
      neighborhood,
      city,
    });

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
