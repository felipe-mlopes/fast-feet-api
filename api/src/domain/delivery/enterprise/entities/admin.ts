import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Role } from './order';

interface AdminProps {
  name: string;
  email: string;
  password: string;
  role: Role.ADMIN;
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id);

    return admin;
  }
}
