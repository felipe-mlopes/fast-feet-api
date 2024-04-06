import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { OrderWithNeighborhoodPresenter } from '@/infra/presenters/order-with-neighborhood-presenter';

import { PageQueryParamsDto } from '../dto/page-query-params.dto';

import { FetchNearbyOrdersDoneUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-done';

@ApiTags('orders')
@Controller('/orders/done')
export class FecthNearbyOrdersDoneController {
  constructor(private fetchNearbyOrdersDone: FetchNearbyOrdersDoneUseCase) {}

  @Get()
  async handle(
    @Query('page')
    page: PageQueryParamsDto,
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
      orders: orders.map(OrderWithNeighborhoodPresenter.toHTTP),
    };
  }
}
