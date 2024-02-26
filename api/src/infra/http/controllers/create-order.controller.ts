import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

const createOrderBodySchema = z.object({
  title: z.string().transform((str) => str.toLowerCase()),
  recipientId: z.string().uuid(),
});

const bodyValidationProps = new ZodValidationPipe(createOrderBodySchema);

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationProps) body: CreateOrderBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, recipientId } = body;
    const userId = user.sub;

    const result = await this.createOrder.execute({
      adminId: userId,
      recipientId,
      title,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
