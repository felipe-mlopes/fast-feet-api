import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-objects/order-details';

export class OrderDetailsPresenter {
  static toHTTP(order: OrderDetails) {
    return {
      id: order.orderId,
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
