import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { AdminUser } from '@/domain/delivery/enterprise/entities/admin-user';

export class InMemoryAdminRepository implements AdminRepository {
  public items: AdminUser[] = [];

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id);

    if (!admin) {
      return null;
    }

    return admin;
  }

  async findByEmail(email: string) {
    const admin = this.items.find((item) => item.email === email);

    if (!admin) {
      return null;
    }

    return admin;
  }

  async findByCPF(cpf: string) {
    const admin = this.items.find((item) => item.cpf === cpf);

    if (!admin) {
      return null;
    }

    return admin;
  }

  async create(admin: AdminUser) {
    this.items.push(admin);
  }
}
