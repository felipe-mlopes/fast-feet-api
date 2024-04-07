import { ApiProperty } from '@nestjs/swagger';

import { OrderWithNeighborhood } from '@/domain/delivery/enterprise/entities/value-objects/order-with-neighborhood';

export class OrderWithNeighborhoodPresenter {
  static toHTTP(order: OrderWithNeighborhood) {
    return {
      id: order.orderId.toString(),
      trackingCode: order.trackingCode,
      title: order.title,
      status: order.status,
      isReturn: order.isReturned,
      recipientId: order.recipientId.toString(),
      recipientNeighborhood: order.recipientNeighborhood,
      createdAt: order.createdAt,
    };
  }
}

class OrderWithNeighborhoodResponse {
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
  recipientNeighborhood: string;

  @ApiProperty()
  createdAt: string;
}

export class OrderWithNeighborhoodResponseDto {
  @ApiProperty({
    type: OrderWithNeighborhoodResponse,
    isArray: true,
  })
  orders: OrderWithNeighborhoodResponse[];
}
