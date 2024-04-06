import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { CreateOrderDto } from '@/infra/http/dto/create-order.dto';

@ApiTags('orders')
@ApiBearerAuth('adminToken')
@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateOrderDto, @CurrentUser() user: UserPayload) {
    const { title, recipientId } = body;
    const userRole = user.role;

    const result = await this.createOrder.execute({
      adminRole: userRole,
      recipientId,
      title,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
