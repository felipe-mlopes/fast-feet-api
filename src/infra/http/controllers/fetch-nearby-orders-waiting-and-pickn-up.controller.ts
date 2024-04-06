import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { OrderWithNeighborhoodPresenter } from '@/infra/presenters/order-with-neighborhood-presenter';

import { PageQueryParamsDto } from '../dto/page-query-params.dto';

import { FetchNearbyOrdersWaitingAndPicknUpUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-waiting-and-pickn-up';

@ApiTags('orders')
@Controller('/orders/pending')
export class FecthNearbyOrdersWaitingAndPicknUpController {
  constructor(
    private fetchNearbyOrdersWaitingOrPicknUp: FetchNearbyOrdersWaitingAndPicknUpUseCase,
  ) {}

  @Get()
  async handle(
    @Query('city')
    city: string,
    @Query('page')
    page: PageQueryParamsDto,
    @CurrentUser() user: UserPayload,
  ) {
    const deliverymanId = user.sub;

    const result = await this.fetchNearbyOrdersWaitingOrPicknUp.execute({
      city,
      page,
      deliverymanId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { orders } = result.value;

    return {
      orders: orders.map(OrderWithNeighborhoodPresenter.toHTTP),
    };
  }
}
