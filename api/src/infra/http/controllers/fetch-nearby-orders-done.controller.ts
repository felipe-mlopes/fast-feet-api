import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { FetchNearbyOrdersDoneUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-done';
import { Status } from '@/domain/delivery/enterprise/entities/order';

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

const statusQueryParamsSchema = z.nativeEnum(Status);

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
const cityQueryValidationPipe = new ZodValidationPipe(cityQueryParamsSchema);
const statusQueryValidationPipe = new ZodValidationPipe(
  statusQueryParamsSchema,
);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;
type CityQueryParamsSchema = z.infer<typeof cityQueryParamsSchema>;

type StatusQueryParamsSchema = z.infer<typeof statusQueryParamsSchema>;

@Controller('/orders')
export class FecthNearbyOrdersDoneController {
  constructor(private fetchNearbyOrdersDone: FetchNearbyOrdersDoneUseCase) {}

  @Get()
  async handle(
    @Query('status', statusQueryValidationPipe) status: StatusQueryParamsSchema,
    @Query('city', cityQueryValidationPipe)
    city: CityQueryParamsSchema,
    @Query('page', pageQueryValidationPipe)
    page: PageQueryParamsSchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.fetchNearbyOrdersDone.execute({
      deliverymanId: userId,
      status,
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
