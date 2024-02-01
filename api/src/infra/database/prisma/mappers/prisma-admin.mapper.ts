import { Prisma, User as PrismaUser } from '@prisma/client';

import { AdminUser } from '@/domain/delivery/enterprise/entities/admin-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): AdminUser {
    return AdminUser.create(
      {
        adminId: new UniqueEntityID(raw.id),
        name: raw.name,
        cpf: raw.cpf,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(admin: AdminUser): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf,
      email: admin.email,
      password: admin.password,
      role: 'ADMIN',
    };
  }
}
