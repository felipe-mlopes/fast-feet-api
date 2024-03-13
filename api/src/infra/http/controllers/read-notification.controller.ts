import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';

import { Public } from '@/infra/auth/public';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';

const notificationBodySchema = z.object({
  trackingCode: z.string(),
});

type NotificationBodySchema = z.infer<typeof notificationBodySchema>;

@Controller('/notifications/:notificationId/read')
@Public()
@UsePipes(new ZodValidationPipe(notificationBodySchema))
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('notificationId') notificationId: string,
    @Body() body: NotificationBodySchema,
  ) {
    const { trackingCode } = body;

    const result = await this.readNotification.execute({
      notificationId,
      trackingCode,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
