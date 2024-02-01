import { AdminUser } from '../../enterprise/entities/admin-user';

export abstract class AdminRepository {
  abstract findByEmail(email: string): Promise<AdminUser | null>;
  abstract findByCPF(cpf: string): Promise<AdminUser | null>;
  abstract create(admin: AdminUser): Promise<void>;
}
