import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface NotificationProps {
  recipientId: UniqueEntityID;
  title: string;
  readAt?: Date;
  createAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createAt() {
    return this.props.createAt;
  }

  read() {
    this.props.readAt = new Date();
  }

  static create(
    props: Optional<NotificationProps, 'createAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createAt: props.createAt ?? new Date(),
      },
      id,
    );

    return notification;
  }
}
