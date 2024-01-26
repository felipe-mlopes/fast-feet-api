import { DeliveryMenRepository } from '../repositories/deliverymen-repository';

import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman';
import { HashGenerator } from '@/domain/delivery/cryptography/hash-generator';

import { Either, left, right } from '@/core/either';
import { DeliveryManAlreadyExistsError } from './errors/deliveryman-already-exists-error';

interface RegisterDeliverymanUseCaseRequest {
  name: string;
  cpf: number;
  password: string;
}

type RegisterDeliverymanUseCaseResponse = Either<
  DeliveryManAlreadyExistsError,
  {
    deliveryman: DeliveryMan;
  }
>;

export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliveryMenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterDeliverymanUseCaseRequest): Promise<RegisterDeliverymanUseCaseResponse> {
    const deliverymanSameWithCPF =
      await this.deliverymanRepository.findByCPF(cpf);

    if (deliverymanSameWithCPF) {
      return left(new DeliveryManAlreadyExistsError(cpf));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryman = DeliveryMan.create({
      name,
      cpf,
      password: hashedPassword,
    });

    await this.deliverymanRepository.create(deliveryman);

    return right({
      deliveryman,
    });
  }
}
