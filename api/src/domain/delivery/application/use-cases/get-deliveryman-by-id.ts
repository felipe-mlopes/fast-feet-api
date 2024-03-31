import { Injectable } from '@nestjs/common';

import { DeliveryManUser } from '../../enterprise/entities/deliveryman-user';

import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

interface GetDeliverymanByIdRequest {
  deliverymanId: string;
}

type GetDeliverymanByIdResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: DeliveryManUser;
  }
>;

@Injectable()
export class GetDeliverymanByIdUseCase {
  constructor(private deliverymenRepository: DeliveryMenRepository) {}

  async execute({
    deliverymanId,
  }: GetDeliverymanByIdRequest): Promise<GetDeliverymanByIdResponse> {
    const deliveryman =
      await this.deliverymenRepository.findById(deliverymanId);

    if (!deliveryman) {
      return left(new ResourceNotFoundError());
    }

    return right({
      deliveryman,
    });
  }
}
