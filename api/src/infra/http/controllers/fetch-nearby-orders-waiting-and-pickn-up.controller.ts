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

const cityQueryParamsSchema = z.string();

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
const cityQueryValidationPipe = new ZodValidationPipe(cityQueryParamsSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;
type CityQueryParamsSchema = z.infer<typeof cityQueryParamsSchema>;

@Controller('/orders/pending')
export class FecthNearbyOrdersWaitingAndPicknUpController {
  constructor(
    private fetchNearbyOrdersWaitingOrPicknUp: FetchNearbyOrdersWaitingAndPicknUpUseCase,
  ) {}

  @Get()
  async handle(
    @Query('city', cityQueryValidationPipe)
    city: CityQueryParamsSchema,
    @Query('page', pageQueryValidationPipe)
    page: PageQueryParamsSchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.fetchNearbyOrdersWaitingOrPicknUp.execute({
      deliverymanId: userId,
      city,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { orders } = result.value;

    return {
      orders: orders.map((order) => OrderPresenter.toHTTP(order)),
    };
  }
}
