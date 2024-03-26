import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

import { ChangeOrderStatusEvent } from '../events/change-order-status-event';

export enum Status {
  WAITING = 'WAITING',
  PICKN_UP = 'PICKN_UP',
  DONE = 'DONE',
}

export enum Role {
  ADMIN = 'ADMIN',
  DELIVERYMAN = 'DELIVERYMAN',
}

export interface OrderProps {
  trackingCode: string;
  title: string;
  recipientId: UniqueEntityID;
  city: string;
  neighborhood: string;
  status: Status;
  isReturned: boolean;
  deliverymanId?: UniqueEntityID | null;
  attachmentId: string;
  createdAt: Date;
  picknUpAt?: Date | null;
  deliveryAt?: Date | null;
  updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  get trackingCode() {
    return this.props.trackingCode;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get city() {
    return this.props.city;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  get status() {
    return this.props.status;
  }

  set status(status: Status) {
    if (Object.values(Status).includes(status)) {
      this.addDomainEvent(new ChangeOrderStatusEvent(this, status));
      this.props.status = status;
      this.touch();

      if (status === Status.PICKN_UP) {
        this.picknUpTouch();
      }

      if (status === Status.DONE) {
        this.deliveryTouch();
      }
    } else {
      console.error('Status invalid.');
    }
  }

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  set deliverymanId(deliverymanId: UniqueEntityID | undefined | null) {
    this.props.deliverymanId = deliverymanId;
    this.touch();
  }

  get isReturned() {
    return this.props.isReturned;
  }

  set isReturned(isReturned: boolean) {
    this.props.isReturned = isReturned;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  set attachmentId(attachament: string) {
    this.props.attachmentId = attachament;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get picknUpAt() {
    return this.props.picknUpAt;
  }

  get deliveryAt() {
    return this.props.deliveryAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private picknUpTouch() {
    this.props.picknUpAt = new Date();
  }

  private deliveryTouch() {
    this.props.deliveryAt = new Date();
  }

  static create(
    props: Optional<
      OrderProps,
      'trackingCode' | 'status' | 'isReturned' | 'attachmentId' | 'createdAt'
    >,
    id?: UniqueEntityID,
  ) {
    const code = new UniqueEntityID().toString().substring(24, 36);

    const order = new Order(
      {
        ...props,
        trackingCode: props.trackingCode ?? code,
        status: props.status ?? Status.WAITING,
        isReturned: props.isReturned ?? false,
        attachmentId: props.attachmentId ?? '',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
