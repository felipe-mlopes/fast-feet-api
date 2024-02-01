import { Either, left, right } from '@/core/either';
import { AdminRepository } from '../repositories/admin-repository';
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error';
import { Injectable } from '@nestjs/common';
import { AdminUser } from '../../enterprise/entities/admin-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

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
  constructor(private adminRepository: AdminRepository) {}

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

    const admin = AdminUser.create({
      adminId: new UniqueEntityID(),
      name,
      email,
      cpf,
      password,
    });

    await this.adminRepository.create(admin);

    return right({
      admin,
    });
  }
}
