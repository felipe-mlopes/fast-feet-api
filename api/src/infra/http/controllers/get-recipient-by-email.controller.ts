import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { GetRecipientByEmailUseCase } from '@/domain/delivery/application/use-cases/get-recipient-by-email';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { RecipientPresenter } from '@/infra/presenters/recipient-presenter';

@Controller('/recipient')
export class GetRecipientByEmailController {
  constructor(private getRecipientByEmail: GetRecipientByEmailUseCase) {}

  @Get()
  async handle(
    @Query('recipientEmail') recipientEmail: string,
    @CurrentUser() user: UserPayload,
  ) {
    const adminRole = user.role;

    const result = await this.getRecipientByEmail.execute({
      recipientEmail,
      adminRole,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { recipient } = result.value;

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    };
  }
}
