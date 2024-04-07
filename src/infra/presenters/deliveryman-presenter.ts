import { ApiProperty } from '@nestjs/swagger';

import { DeliveryManUser } from '@/domain/delivery/enterprise/entities/deliveryman-user';

export class DeliverymanPresenter {
  static toHTTP(deliveryman: DeliveryManUser) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      cpf: deliveryman.cpf,
      email: deliveryman.email,
    };
  }
}

class DeliverymanResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  email: string;
}

export class DeliverymanResponseDto {
  @ApiProperty({ type: DeliverymanResponse })
  recipient: DeliverymanResponse;
}
