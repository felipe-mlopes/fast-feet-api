import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface OrderWithNeighborhoodProps {
  orderId: UniqueEntityID;
  trackingCode: string;
  title: string;
  status: string;
  isReturned: boolean;
  recipientId: UniqueEntityID;
  recipientNeighborhood: string;
  createdAt: Date;
  updatedAt?: Date | null;
}
export class OrderWithNeighborhood extends ValueObject<OrderWithNeighborhoodProps> {
  get orderId() {
    return this.props.orderId;
  }

  get trackingCode() {
    return this.props.trackingCode;
  }

  get title() {
    return this.props.title;
  }

  get status() {
    return this.props.status;
  }

  get isReturned() {
    return this.props.isReturned;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get recipientNeighborhood() {
    return this.props.recipientNeighborhood;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: OrderWithNeighborhoodProps) {
    return new OrderWithNeighborhood(props);
  }
}
