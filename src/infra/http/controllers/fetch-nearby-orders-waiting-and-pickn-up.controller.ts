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

import { FetchNearbyOrdersWaitingAndPicknUpUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-orders-waiting-and-pickn-up';

@ApiTags('orders')
@ApiBearerAuth('deliverymanToken')
@Controller('/orders/pending')
export class FecthNearbyOrdersWaitingAndPicknUpController {
  constructor(
    private fetchNearbyOrdersWaitingOrPicknUp: FetchNearbyOrdersWaitingAndPicknUpUseCase,
  ) {}

  @ApiOperation({
    summary: 'Fetch recent orders pending',
    description:
      'Fetch recent orders of the same city with waiting status and those picked up by deliveryman logged in.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Orders with waiting status and those picked up by deliveryman logged in.',
    type: OrderWithNeighborhoodResponseDto,
  })
  @Get()
  async handle(
    @Query('city')
    city: string,
    @Query()
    query: PageQueryParamsDto,
    @CurrentUser() user: UserPayload,
  ): Promise<OrderWithNeighborhoodPresenter> {
    const deliverymanId = user.sub;

    const result = await this.fetchNearbyOrdersWaitingOrPicknUp.execute({
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
