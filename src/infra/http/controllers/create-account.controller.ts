import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/infra/auth/public';

import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { CreateAccountDto } from '@/infra/http/dto/create-account.dto';
import { AdminAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/admin-already-exists-error';

@ApiTags('admin')
@Controller('/account')
@Public()
export class CreateAccountController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountDto) {
    const { name, email, cpf, password } = body;

    const result = await this.registerAdmin.execute({
      name,
      email,
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AdminAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
