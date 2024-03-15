import { Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { SendEmail } from '@/domain/notification/application/mailing/sendEmail';
import { Mailer } from './mailer';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: SendEmail,
      useClass: Mailer,
    },
  ],
  exports: [SendEmail],
})
export class MailModule {}
