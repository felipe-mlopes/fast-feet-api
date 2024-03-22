import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { FetchNearbyOrdersDoneUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-done';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { OrderPresenter } from '@/infra/presenters/order-presenter';

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller('/orders/done')
export class FecthNearbyOrdersDoneController {
  constructor(private fetchNearbyOrdersDone: FetchNearbyOrdersDoneUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe)
    page: PageQueryParamsSchema,
    @Query('city')
    city: string,
    @CurrentUser()
    user: UserPayload,
  ) {
    const deliverymanId = user.sub;

    const result = await this.fetchNearbyOrdersDone.execute({
      city,
      page,
      deliverymanId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { orders } = result.value;

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    };
  }
}
