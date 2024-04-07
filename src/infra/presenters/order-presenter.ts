import { ApiProperty } from '@nestjs/swagger';

import { Order } from '@/domain/delivery/enterprise/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      trackingCode: order.trackingCode,
      title: order.title,
      status: order.status,
      isReturn: order.isReturned,
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      createdAt: order.createdAt,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
    };
  }
}

class OrderResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  trackingCode: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isReturn: boolean;

  @ApiProperty()
  recipientId: string;

  @ApiProperty()
  deliverymanId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  picknUpAt: string;

  @ApiProperty()
  deliveryAt: string;
}

export class OrderResponseDto {
  @ApiProperty({ type: OrderResponse })
  order: OrderResponse;
}
