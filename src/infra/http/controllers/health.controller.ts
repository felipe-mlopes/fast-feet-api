import { Controller, Get, HttpCode } from '@nestjs/common';

import { Public } from '@/infra/auth/public';

@Controller('/health')
@Public()
export class HealthController {
  @Get()
  @HttpCode(200)
  async handle() {
    return {
      status: 'ok',
    };
  }
}
