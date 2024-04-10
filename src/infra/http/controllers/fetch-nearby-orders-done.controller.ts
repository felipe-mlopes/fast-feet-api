import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  OrderWithNeighborhoodPresenter,
  OrderWithNeighborhoodResponseDto,
} from '@/infra/presenters/order-with-neighborhood-presenter';

import { PageQueryParamsDto } from '../dto/page-query-params.dto';

import { FetchNearbyOrdersDoneUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-done';

@ApiTags('orders')
@ApiBearerAuth('deliverymanToken')
@Controller('/orders/done')
export class FecthNearbyOrdersDoneController {
  constructor(private fetchNearbyOrdersDone: FetchNearbyOrdersDoneUseCase) {}

  @ApiOperation({
    summary: 'Fetch recent orders done',
    description:
      'Fetch recent orders done by logged in deliveryman from the same city',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders with done status',
    type: OrderWithNeighborhoodResponseDto,
  })
  @Get()
  async handle(
    @Query('city')
    city: string,
    @Query()
    query: PageQueryParamsDto,
    @CurrentUser()
    user: UserPayload,
  ): Promise<OrderWithNeighborhoodPresenter> {
    const deliverymanId = user.sub;

    const result = await this.fetchNearbyOrdersDone.execute({
      city,
      page: query.page,
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
