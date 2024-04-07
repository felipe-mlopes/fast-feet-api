import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { EnvService } from '../env/env.service';

import {
  SendEmail,
  SendEmailParams,
} from '@/domain/notification/application/mailing/sendEmail';

@Injectable()
export class Mailer implements SendEmail {
  private transport: nodemailer.Transporter;

  constructor(private envService: EnvService) {
    this.transport = nodemailer.createTransport({
      host: envService.get('MAIL_HOST'),
      port: envService.get('MAIL_PORT'),
      secure: true,
      auth: {
        user: envService.get('MAIL_USER'),
        pass: envService.get('MAIL_PASS'),
      },
    });
  }

  async send({ to, subject, html }: SendEmailParams): Promise<void> {
    try {
      await this.transport.sendMail({
        from: this.envService.get('MAIL_FROM'),
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
