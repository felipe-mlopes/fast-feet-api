import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/infra/auth/public';

import { RegisterDeliverymanUseCase } from '@/domain/delivery/application/use-cases/register-deliveryman';
import { RegisterDeliverymanDto } from '@/infra/http/dto/register-deliveryman.dto';
import { DeliveryManAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/deliveryman-already-exists-error';

@ApiTags('deliveryman')
@Controller('/deliveryman')
@Public()
export class RegisterDeliveryManController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @ApiOperation({
    summary: 'Create deliveryman account',
  })
  @ApiResponse({
    status: 201,
    description: 'The deliveryman account has been successfully created',
  })
  @Post()
  @HttpCode(201)
  async handle(@Body() body: RegisterDeliverymanDto) {
    const { name, cpf, email, password } = body;

    const result = await this.registerDeliveryman.execute({
      name,
      cpf,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeliveryManAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      message: 'The deliveryman account has been successfully created.',
    };
  }
}
