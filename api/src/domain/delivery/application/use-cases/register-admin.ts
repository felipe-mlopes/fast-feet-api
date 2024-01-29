import { Either, right } from '@/core/either';
import { Admin } from '../../enterprise/entities/admin';
import { AdminRepository } from '../repositories/admin-repository';
import { Role } from '../../enterprise/entities/order';

interface RegisterAdminUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterAdminUseCaseResponse = Either<
  null,
  {
    admin: Admin;
  }
>;

export class RegisterAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    name,
    password,
    email,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const admin = Admin.create({
      name,
      password,
      email,
      role: Role.ADMIN,
    });

    await this.adminRepository.create(admin);

    return right({
      admin,
    });
  }
}
