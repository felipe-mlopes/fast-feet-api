import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface OrderDetailsProps {
  orderId: UniqueEntityID;
  trackingCode: string;
  title: string;
  status: string;
  isReturned: boolean;
  recipientId: UniqueEntityID;
  recipientName: string;
  recipientAddress: string;
  recipientZipcode: number;
  recipientState: string;
  recipientCity: string;
  recipientNeighborhood: string;
  deliverymanId?: UniqueEntityID | null;
  attachmentId?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  picknUpAt?: Date | null;
  deliveryAt?: Date | null;
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
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

  get recipientName() {
    return this.props.recipientName;
  }

  get recipientAddress() {
    return this.props.recipientAddress;
  }

  get recipientZipcode() {
    return this.props.recipientZipcode;
  }

  get recipientState() {
    return this.props.recipientState;
  }

  get recipientCity() {
    return this.props.recipientCity;
  }

  get recipientNeighborhood() {
    return this.props.recipientNeighborhood;
  }

  get deliverymanId() {
    return this.props.deliverymanId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get picknUpAt() {
    return this.props.picknUpAt;
  }

  get deliveryAt() {
    return this.props.deliveryAt;
  }

  static create(props: OrderDetailsProps) {
    return new OrderDetails(props);
  }
}
