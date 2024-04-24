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
  RecipientEmailPresenter,
  RecipientEmailResponseDto,
} from '@/infra/presenters/recipient-email-presenter';

import { FetchRecipientEmailsBySearchUseCase } from '@/domain/delivery/application/use-cases/fetch-recipient-emails-by-search';

@ApiTags('recipient')
@ApiBearerAuth('adminToken')
@Controller('/recipient-email')
export class FecthRecipientEmailsBySearchController {
  constructor(
    private fetchRecipientEmailsBySearch: FetchRecipientEmailsBySearchUseCase,
  ) {}

  @ApiOperation({
    summary: 'Fetch recipient emails by search',
  })
  @ApiResponse({
    status: 200,
    description:
      'Orders with waiting status and those picked up by deliveryman logged in.',
    type: RecipientEmailResponseDto,
  })
  @Get()
  async handle(
    @Query('search')
    search: string,
    @CurrentUser() user: UserPayload,
  ): Promise<RecipientEmailPresenter> {
    const adminRole = user.role;

    const result = await this.fetchRecipientEmailsBySearch.execute({
      adminRole,
      search,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { recipientEmails } = result.value;

    return {
      recipientEmails: recipientEmails.map(RecipientEmailPresenter.toHTTP),
    };
  }
}
