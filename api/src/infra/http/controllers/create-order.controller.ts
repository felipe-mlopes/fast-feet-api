import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { UserRole } from '@prisma/client';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { Role } from '@/domain/delivery/enterprise/entities/order';

const createOrderBodySchema = z.object({
  title: z.string(),
  recipientId: z.string().uuid(),
});

const bodyValidationProps = new ZodValidationPipe(createOrderBodySchema);

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(@Body(bodyValidationProps) body: CreateOrderBodySchema) {
    const { title, recipientId } = body;

    const result = await this.createOrder.execute({
      title,
      role: UserRole.ADMIN as Role,
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
