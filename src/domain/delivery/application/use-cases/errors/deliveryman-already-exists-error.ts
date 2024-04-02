import { UseCaseError } from '@/core/errors/use-case-error';

export class DeliveryManAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Deliveryman "${identifier}" already exists.`);
  }
}
