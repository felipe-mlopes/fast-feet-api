import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Role } from './order';
import { User, UserProps } from './user';
import { Optional } from '@/core/types/optional';

export interface AdminUserProps extends UserProps {
  adminId: UniqueEntityID;
}

export class AdminUser extends User<AdminUserProps> {
  get adminId() {
    return this.props.adminId;
  }

  static create(
    props: Optional<AdminUserProps, 'createdAt' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const adminUser = new AdminUser(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: Role.ADMIN,
      },
      id,
    );

    return adminUser;
  }
}
