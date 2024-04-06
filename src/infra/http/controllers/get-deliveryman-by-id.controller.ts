import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetDeliverymanByIdUseCase } from '@/domain/delivery/application/use-cases/get-deliveryman-by-id';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeliverymanPresenter } from '@/infra/presenters/deliveryman-presenter';

@ApiTags('deliveryman')
@Controller('/deliveryman')
export class GetDeliverymanByIdController {
  constructor(private getDeliverymanById: GetDeliverymanByIdUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const deliverymanId = user.sub;

    const result = await this.getDeliverymanById.execute({
      deliverymanId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { deliveryman } = result.value;

    return {
      deliveryman: DeliverymanPresenter.toHTTP(deliveryman),
    };
  }
}
