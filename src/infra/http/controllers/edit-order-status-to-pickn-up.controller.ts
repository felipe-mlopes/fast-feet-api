import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { EditOrderStatusToPicknUpUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-pickn-up';

@ApiTags('orders')
@ApiBearerAuth('deliverymanToken')
@Controller('/orders/:orderId/picknup')
export class EditOrderStatusToPicknUpController {
  constructor(
    private editOrderStatusToPicknUp: EditOrderStatusToPicknUpUseCase,
  ) {}

  @ApiOperation({
    summary: "Edit order status to pick'n up",
    description: 'Only deliveryman user.',
  })
  @ApiResponse({
    status: 204,
    description: "The order status has been changed to successfully pick'n up",
  })
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const deliverymanId = user.sub;

    const result = await this.editOrderStatusToPicknUp.execute({
      deliverymanId,
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
