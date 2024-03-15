import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const registerRecipientBodySchema = z.object({
  name: z.string().transform((str) => str.toLowerCase()),
  email: z
    .string()
    .email()
    .transform((str) => str.toLowerCase()),
  zipcode: z.number(),
  address: z.string().transform((str) => str.toLowerCase()),
  city: z.string().transform((str) => str.toLowerCase()),
  neighborhood: z.string().transform((str) => str.toLowerCase()),
});

const bodyValidationProps = new ZodValidationPipe(registerRecipientBodySchema);

type RegisterRecipientBodySchema = z.infer<typeof registerRecipientBodySchema>;

@Controller('/recipients')
export class RegisterRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationProps) body: RegisterRecipientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, address, zipcode, neighborhood, city } = body;
    const userId = user.sub;

    const result = await this.registerRecipient.execute({
      adminId: userId,
      name,
      email,
      address,
      zipcode,
      neighborhood,
      city,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
