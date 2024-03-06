import { Injectable } from '@nestjs/common';

import { DeliveryMenRepository } from '../repositories/deliverymen-repository';
import { Encrypter } from '../../cryptography/encrypter';
import { HashComparer } from '../../cryptography/hash-comparer';

import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateDeliverymenUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateDeliverymenUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateDeliverymenUseCase {
  constructor(
    private deliverymenRepository: DeliveryMenRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateDeliverymenUseCaseRequest): Promise<AuthenticateDeliverymenUseCaseResponse> {
    const deliveryman = await this.deliverymenRepository.findByEmail(email);

    if (!deliveryman) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryman.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    });

    return right({
      accessToken,
    });
  }
}
