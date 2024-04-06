import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/infra/auth/public';

import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error';
import { AuthenticateAccountDto } from '@/infra/http/dto/authenticate-account.dto';

@ApiTags('admin')
@Controller('/account/sessions')
@Public()
export class AuthenticateAccountController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateAccountDto) {
    const { email, password } = body;

    const result = await this.authenticateAdmin.execute({
      email,
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
