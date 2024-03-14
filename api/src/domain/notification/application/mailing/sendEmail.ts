export interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
}

export abstract class SendEmail {
  abstract send(params: SendEmailParams): Promise<void>;
}
