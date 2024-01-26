import { UniqueEntityID } from '../entities/unique-entity-id';

export abstract class DomainEvent {
  abstract ocurredAt: Date;
  abstract getAggregateId(): UniqueEntityID;
}
