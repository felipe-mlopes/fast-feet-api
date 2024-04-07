import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  DeliverymanPresenter,
  DeliverymanResponseDto,
} from '@/infra/presenters/deliveryman-presenter';

import { GetDeliverymanByIdUseCase } from '@/domain/delivery/application/use-cases/get-deliveryman-by-id';

@ApiTags('deliveryman')
@Controller('/deliveryman')
export class GetDeliverymanByIdController {
  constructor(private getDeliverymanById: GetDeliverymanByIdUseCase) {}

  @ApiOperation({
    summary: 'Get deliveryman by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deliveryman',
    type: DeliverymanResponseDto,
  })
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
