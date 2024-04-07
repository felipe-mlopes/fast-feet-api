import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  RecipientPresenter,
  RecipientResponseDto,
} from '@/infra/presenters/recipient-presenter';

import { GetRecipientByEmailUseCase } from '@/domain/delivery/application/use-cases/get-recipient-by-email';

@ApiTags('recipient')
@ApiBearerAuth('adminToken')
@Controller('/recipient')
export class GetRecipientByEmailController {
  constructor(private getRecipientByEmail: GetRecipientByEmailUseCase) {}

  @ApiOperation({
    summary: 'Get recipient by email',
  })
  @ApiResponse({
    status: 200,
    description: 'Recipient',
    type: RecipientResponseDto,
  })
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
