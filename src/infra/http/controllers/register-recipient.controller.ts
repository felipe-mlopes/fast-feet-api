import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient';
import { RegisterRecipientDto } from '@/infra/http/dto/register-recipient.dto';

@ApiTags('recipient')
@Controller('/recipients')
export class RegisterRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body() body: RegisterRecipientDto,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, address, zipcode, neighborhood, city, state } = body;
    const userId = user.sub;

    const result = await this.registerRecipient.execute({
      adminId: userId,
      name,
      email,
      address,
      zipcode,
      neighborhood,
      city,
      state,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
