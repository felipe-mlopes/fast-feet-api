import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  OrderDetailsPresenter,
  OrderDetailsResponseDto,
} from '@/infra/presenters/order-details-presenter';

import { GetOrderDetailsUseCase } from '@/domain/delivery/application/use-cases/get-order-details';

@ApiTags('orders')
@ApiBearerAuth('deliverymanToken')
@Controller('/orders/:orderId')
export class GetOrderDetailsController {
  constructor(private getOrderDetails: GetOrderDetailsUseCase) {}

  @ApiOperation({
    summary: 'Get order details',
  })
  @ApiResponse({
    status: 200,
    description: 'Order details.',
    type: OrderDetailsResponseDto,
  })
  @Get()
  async handle(@Param('orderId') orderId: string) {
    const result = await this.getOrderDetails.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { order } = result.value;

    return {
      order: OrderDetailsPresenter.toHTTP(order),
    };
  }
}
