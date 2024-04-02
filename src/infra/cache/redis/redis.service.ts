import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private nextErrorMessageTime: Date | null = null;

  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'),
      db: envService.get('REDIS_DB'),
    });

    this.on('error', (error) => {
      const currentDate = new Date();

      if (
        !this.nextErrorMessageTime ||
        currentDate > this.nextErrorMessageTime
      ) {
        const nextErrorMessageAlert = new Date();
        nextErrorMessageAlert.setMinutes(
          nextErrorMessageAlert.getMinutes() + 5,
        );

        this.nextErrorMessageTime = nextErrorMessageAlert;

        console.error('Redis connection error:', error);
      }
    });

    this.on('ready', () => {
      this.nextErrorMessageTime = null;
    });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
