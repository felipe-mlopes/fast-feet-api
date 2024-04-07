import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/infra/auth/public';
import {
  OrderPresenter,
  OrderResponseDto,
} from '@/infra/presenters/order-presenter';

import { GetOrderByTrackingCodeUseCase } from '@/domain/delivery/application/use-cases/get-order-by-tracking-code';

@ApiTags('orders')
@Controller('/recipient-query')
@Public()
export class GetOrderByTrackingCodeController {
  constructor(private getOrderByTrackingCode: GetOrderByTrackingCodeUseCase) {}

  @ApiOperation({
    summary: 'Get order by tracking code',
  })
  @ApiResponse({
    status: 200,
    description: 'Order',
    type: OrderResponseDto,
  })
  @Get()
  async handle(@Query('trackingCode') trackingCode: string) {
    const result = await this.getOrderByTrackingCode.execute({
      trackingCode,
    });

    if (result.isLeft()) {
      return null;
    }

    return {
      order: result.value?.order
        ? OrderPresenter.toHTTP(result.value?.order)
        : null,
    };
  }
}
