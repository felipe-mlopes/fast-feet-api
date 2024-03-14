import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface RecipientProps {
  name: string;
  email: string;
  zipcode: number;
  address: string;
  city: string;
  neighborhood: string;
  orderIds: string[];
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get zipcode() {
    return this.props.zipcode;
  }

  set zipcode(zipcode: number) {
    this.props.zipcode = zipcode;
  }

  get address() {
    return this.props.address;
  }

  set address(address: string) {
    this.props.address = address;
  }

  get city() {
    return this.props.city;
  }

  set city(city: string) {
    this.props.city = city;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood;
  }

  get orderIds() {
    return this.props.orderIds;
  }

  set orderIds(orderId: string[]) {
    this.props.orderIds === orderId;
  }

  static create(
    props: Optional<RecipientProps, 'orderIds'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        orderIds: props.orderIds ?? [],
      },
      id,
    );

    return recipient;
  }
}
