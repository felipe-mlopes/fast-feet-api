import {
  SendEmail,
  SendEmailParams,
} from '@/domain/notification/application/mailing/sendEmail';

interface Email {
  to: string[];
  subject: string;
  html: string;
}

export class FakeSendEmail implements SendEmail {
  public email: Email[] = [];

  async send({ to, subject, html }: SendEmailParams): Promise<void> {
    this.email.push({
      to,
      subject,
      html,
    });
  }
}
