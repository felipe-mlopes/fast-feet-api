import { Either, left, right } from '@/core/either';
import { AdminRepository } from '../repositories/admin-repository';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Encrypter } from '../../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { Injectable } from '@nestjs/common';

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
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      return left(new Error());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
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
