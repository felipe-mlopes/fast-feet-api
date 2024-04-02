import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';

import { EditOrderStatusToReturnUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-return';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/orders/:orderId/return')
export class EditOrderStatusToReturnController {
  constructor(
    private editOrderStatusToReturn: EditOrderStatusToReturnUseCase,
  ) {}

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
