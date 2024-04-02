import { Controller, Get, Query } from '@nestjs/common';

import { GetOrderByTrackingCodeUseCase } from '@/domain/delivery/application/use-cases/get-order-by-tracking-code';

import { Public } from '@/infra/auth/public';
import { OrderPresenter } from '@/infra/presenters/order-presenter';

@Controller('/recipient-query')
@Public()
export class GetOrderByTrackingCodeController {
  constructor(private getOrderByTrackingCode: GetOrderByTrackingCodeUseCase) {}

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
