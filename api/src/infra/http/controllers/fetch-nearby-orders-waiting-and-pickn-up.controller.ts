import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { FetchNearbyOrdersWaitingAndPicknUpUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-waiting-and-pickn-up';

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

@Controller('/orders/pending')
export class FecthNearbyOrdersWaitingAndPicknUpController {
  constructor(
    private fetchNearbyOrdersWaitingOrPicknUp: FetchNearbyOrdersWaitingAndPicknUpUseCase,
  ) {}

  @Get()
  async handle(
    @Query('city')
    city: string,
    @Query('page', pageQueryValidationPipe)
    page: PageQueryParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const deliverymanRole = user.role;

    const result = await this.fetchNearbyOrdersWaitingOrPicknUp.execute({
      city,
      page,
      deliverymanRole,
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
