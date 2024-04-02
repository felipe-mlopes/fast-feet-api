import { EditOrderStatusToDoneUseCase } from '@/domain/delivery/application/use-cases/edit-order-status-to-done';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';

@Controller('/orders/:orderId/done')
export class EditOrderStatusToDoneController {
  constructor(private editOrderStatusToDone: EditOrderStatusToDoneUseCase) {}

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
