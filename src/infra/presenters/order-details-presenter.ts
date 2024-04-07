import { ApiProperty } from '@nestjs/swagger';

import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-objects/order-details';

export class OrderDetailsPresenter {
  static toHTTP(order: OrderDetails) {
    return {
      id: order.orderId.toString,
      trackingCode: order.trackingCode,
      title: order.title,
      status: order.status,
      isReturn: order.isReturned,
      recipientId: order.recipientId.toString(),
      recipientName: order.recipientName,
      recipientAddress: order.recipientAddress,
      recipientZipcode: order.recipientZipcode,
      recipientState: order.recipientState,
      recipientCity: order.recipientCity,
      recipientNeighborhood: order.recipientNeighborhood,
      deliverymanId: order.deliverymanId?.toString(),
      createdAt: order.createdAt,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
    };
  }
}

class OrderDetailsResponse {
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
  recipientName: string;

  @ApiProperty()
  recipientAddress: string;

  @ApiProperty()
  recipientZipcode: number;

  @ApiProperty()
  recipientState: string;

  @ApiProperty()
  recipientCity: string;

  @ApiProperty()
  recipientNeighborhood: string;

  @ApiProperty()
  deliverymanId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  picknUpAt: string;

  @ApiProperty()
  deliveryAt: string;
}

export class OrderDetailsResponseDto {
  @ApiProperty({ type: OrderDetailsResponse })
  order: OrderDetailsResponse;
}
