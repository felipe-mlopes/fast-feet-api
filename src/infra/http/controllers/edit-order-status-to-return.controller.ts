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

import { EditOrderStatusToReturnUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-return';

@ApiTags('orders')
@ApiBearerAuth('deliverymanToken')
@Controller('/orders/:orderId/return')
export class EditOrderStatusToReturnController {
  constructor(
    private editOrderStatusToReturn: EditOrderStatusToReturnUseCase,
  ) {}

  @ApiOperation({
    summary: 'Edit order status to returned',
    description: 'Only deliveryman user.',
  })
  @ApiResponse({
    status: 204,
    description: 'The order status has been changed to successfully returned',
  })
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const deliverymanId = user.sub;

    const result = await this.editOrderStatusToReturn.execute({
      deliverymanId,
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
