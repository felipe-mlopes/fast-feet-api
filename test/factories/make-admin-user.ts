import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  AdminUser,
  AdminUserProps,
} from '@/domain/delivery/enterprise/entities/admin-user';
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper';

export function makeAdminUser(
  override: Partial<AdminUserProps> = {},
  id?: UniqueEntityID,
) {
  const admin = AdminUser.create(
    {
      adminId: new UniqueEntityID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric(11),
      password: faker.string.alphanumeric(6),
      ...override,
    },
    id,
  );

  return admin;
}

@Injectable()
export class AdminUserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdminUser(
    data: Partial<AdminUserProps> = {},
  ): Promise<AdminUser> {
    const admin = makeAdminUser(data);

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    });

    return admin;
  }
}
