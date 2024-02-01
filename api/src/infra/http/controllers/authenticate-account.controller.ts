import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

import { Public } from '@/infra/auth/public';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
@Public()
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateAccountController {
  constructor(
    private authenticateAdmin: AuthenticateAdminUseCase,
    private prisma: PrismaService,
  ) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
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
