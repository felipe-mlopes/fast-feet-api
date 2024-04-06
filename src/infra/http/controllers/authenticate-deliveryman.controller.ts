import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/infra/auth/public';

import { AuthenticateDeliverymenUseCase } from '@/domain/delivery/application/use-cases/authenticate-deliveryman';
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error';
import { AuthetincateDeliverymanDto } from '@/infra/http/dto/authenticate-deliveryman.dto';

@ApiTags('deliveryman')
@Controller('/deliveryman/sessions')
@Public()
export class AuthenticateDeliverymanController {
  constructor(
    private authenticateDeliveryman: AuthenticateDeliverymenUseCase,
  ) {}

  @Post()
  async handle(@Body() body: AuthetincateDeliverymanDto) {
    const { cpf, password } = body;

    const result = await this.authenticateDeliveryman.execute({
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
