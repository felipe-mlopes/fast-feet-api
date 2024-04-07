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
import { CreateAccountDto } from '@/infra/http/dto/create-account.dto';

import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { AdminAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/admin-already-exists-error';

@ApiTags('admin')
@Controller('/account')
@Public()
export class CreateAccountController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @ApiOperation({
    summary: 'Create admin account',
  })
  @ApiResponse({
    status: 201,
    description: 'The admin account has been successfully created',
  })
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

    return {
      message: 'The admin account has been successfully created.',
    };
  }
}
