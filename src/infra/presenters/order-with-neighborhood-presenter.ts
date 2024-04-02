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
