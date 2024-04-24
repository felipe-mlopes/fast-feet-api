import { ApiProperty } from '@nestjs/swagger';

import { RecipientEmail } from '@/domain/delivery/enterprise/entities/value-objects/recipient-email';

export class RecipientEmailPresenter {
  static toHTTP(recipient: RecipientEmail) {
    return {
      email: recipient.email,
    };
  }
}

class RecipientEmailResponse {
  @ApiProperty()
  email: string;
}

export class RecipientEmailResponseDto {
  @ApiProperty({ type: RecipientEmailResponse })
  recipient: RecipientEmailResponse[];
}
