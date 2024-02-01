import { Injectable } from '@nestjs/common';

import { AdminRepository } from '../repositories/admin-repository';
import { Encrypter } from '../../cryptography/encrypter';
import { HashComparer } from '../../cryptography/hash-comparer';

import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { HashGenerator } from '../../cryptography/hash-generator';

interface AuthenticateAdminUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      return left(new WrongCredentialsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const isPasswordValid = await this.hashComparer.compare(
      hashedPassword,
      admin.password,
    );

    if (isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
      role: admin.role,
    });

    return right({
      accessToken,
    });
  }
}
