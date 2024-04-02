import { Injectable } from '@nestjs/common';

import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

import { HashGenerator } from '@/domain/delivery/cryptography/hash-generator';

import { DeliveryManUser } from '../../enterprise/entities/deliveryman-user';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { DeliveryManAlreadyExistsError } from './errors/deliveryman-already-exists-error';

interface RegisterDeliverymanUseCaseRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

type RegisterDeliverymanUseCaseResponse = Either<
  DeliveryManAlreadyExistsError,
  {
    deliveryman: DeliveryManUser;
  }
>;

@Injectable()
export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliveryMenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    email,
    password,
  }: RegisterDeliverymanUseCaseRequest): Promise<RegisterDeliverymanUseCaseResponse> {
    const deliverymanSameWithCPF =
      await this.deliverymanRepository.findByCPF(cpf);

    if (deliverymanSameWithCPF) {
      return left(new DeliveryManAlreadyExistsError(cpf));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryman = DeliveryManUser.create({
      deliveryManId: new UniqueEntityID(),
      name,
      cpf,
      email,
      password: hashedPassword,
    });

    await this.deliverymanRepository.create(deliveryman);

    return right({
      deliveryman,
    });
  }
}
