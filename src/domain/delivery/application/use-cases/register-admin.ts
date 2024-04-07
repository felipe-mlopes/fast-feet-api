import { Injectable } from '@nestjs/common';

import { AdminRepository } from '../repositories/admin-repository';
import { HashGenerator } from '../../cryptography/hash-generator';

import { AdminUser } from '../../enterprise/entities/admin-user';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error';

interface RegisterAdminUseCaseRequest {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  {
    admin: AdminUser;
  }
>;

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    cpf,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminSameWithEmail = await this.adminRepository.findByEmail(email);

    if (adminSameWithEmail) {
      return left(new AdminAlreadyExistsError(email));
    }

    const adminSameWithCpf = await this.adminRepository.findByCPF(cpf);

    if (adminSameWithCpf) {
      return left(new AdminAlreadyExistsError(cpf));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const admin = AdminUser.create({
      adminId: new UniqueEntityID(),
      name,
      email,
      cpf,
      password: hashedPassword,
    });

    await this.adminRepository.create(admin);

    return right({
      admin,
    });
  }
}
