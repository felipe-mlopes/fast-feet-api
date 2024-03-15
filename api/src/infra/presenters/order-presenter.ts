import { Order } from '@/domain/delivery/enterprise/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      trackingCode: order.trackingCode,
      title: order.title,
      recipientId: order.recipientId.toString(),
      status: order.status,
      isReturn: order.isReturned,
      city: order.city,
      neighborhood: order.neighborhood,
      createdAt: order.createdAt,
      picknUpAt: order.picknUpAt,
      deliveryAt: order.deliveryAt,
    };
  }
}
