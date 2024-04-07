import { ApiProperty } from '@nestjs/swagger';

import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      zipcode: recipient.zipcode,
      address: recipient.address,
      state: recipient.state,
      city: recipient.city,
      neighborhood: recipient.neighborhood,
    };
  }
}

class RecipientResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  zipcode: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  neighborhood: string;
}

export class RecipientResponseDto {
  @ApiProperty({ type: RecipientResponse })
  recipient: RecipientResponse[];
}
