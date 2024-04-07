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

import { EditOrderStatusToDoneUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-done';

@ApiTags('orders')
@ApiBearerAuth('deliverymanToken')
@Controller('/orders/:orderId/done')
export class EditOrderStatusToDoneController {
  constructor(private editOrderStatusToDone: EditOrderStatusToDoneUseCase) {}

  @ApiOperation({
    summary: 'Edit order status to done',
    description: 'Only deliveryman user.',
  })
  @ApiResponse({
    status: 204,
    description: 'The order status has been changed to successfully done',
  })
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const deliverymanId = user.sub;

    const result = await this.editOrderStatusToDone.execute({
      deliverymanId,
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
