import { GetOrderDetailsUseCase } from '@/domain/delivery/application/use-cases/get-order-details';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

@Controller('/orders/:orderId')
export class GetOrderDetailsController {
  constructor(private getOrderDetails: GetOrderDetailsUseCase) {}

  @Get()
  async handle(@Param('orderId') orderId: string) {
    const result = await this.getOrderDetails.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { order, recipient } = result.value;

    return {
      order,
      recipient,
    };
  }
}
