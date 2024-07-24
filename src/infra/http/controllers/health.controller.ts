import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { Public } from '@/infra/auth/public';

@Controller('/health')
@Public()
@ApiExcludeController()
export class HealthController {
  @Get()
  @HttpCode(200)
  async handle() {
    return {
      status: 'ok',
    };
  }
}
