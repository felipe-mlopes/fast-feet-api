import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { AdminAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/admin-already-exists-error';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
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
