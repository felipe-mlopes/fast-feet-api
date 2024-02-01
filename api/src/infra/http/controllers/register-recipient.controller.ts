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
  name: z.string(),
  zipcode: z.number(),
  address: z.string(),
  city: z.string(),
  neighborhood: z.string(),
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
    const { name, address, zipcode, neighborhood, city } = body;
    const userId = user.sub;

    const result = await this.registerRecipient.execute({
      adminId: userId,
      name,
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
