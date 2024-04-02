import { Entity } from '@/core/entities/entity';
import { Role } from './order';

export interface UserProps {
  name: string;
  email: string;
  cpf: string;
  password: string;
  role: Role;
  createdAt: Date;
}

export class User<Props extends UserProps> extends Entity<Props> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
