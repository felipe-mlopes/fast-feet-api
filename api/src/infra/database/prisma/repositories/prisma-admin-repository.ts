import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { AdminUser } from '@/domain/delivery/enterprise/entities/admin-user';
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper';

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AdminUser | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  async findByEmail(email: string) {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  async findByCPF(cpf: string): Promise<AdminUser | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (!admin) {
      return null;
    }

    return PrismaAdminMapper.toDomain(admin);
  }

  async create(admin: AdminUser) {
    const data = PrismaAdminMapper.toPrisma(admin);

    await this.prisma.user.create({
      data,
    });
  }
}
