import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { Admin } from '@/domain/delivery/enterprise/entities/admin';

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = [];

  async findByEmail(email: string) {
    const admin = this.items.find((item) => item.email === email);

    if (!admin) {
      return null;
    }

    return admin;
  }

  async create(admin: Admin) {
    this.items.push(admin);
  }
}
