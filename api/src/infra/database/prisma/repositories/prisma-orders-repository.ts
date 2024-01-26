import { PaginationParams } from '@/core/repositories/pagination-params';
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { Order, Status } from '@/domain/delivery/enterprise/entities/order';
import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return null;
    }

    const client = await this.prisma.shipping.findUnique({
      where: {
        id: order.clientId,
      },
    });

    if (!client) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order, client);
  }

  async findManyRecentByStatus(
    status: Status,
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    /*
    
    const orders = await this.prisma.order.findMany({
      where: {
        status,
        deliverymanId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    const client = await this.prisma.shipping.findUnique({
      where: {
        id: orders.find((order) => order.clientId),
      },
    });

    return orders.map((order) => PrismaOrderMapper.toDomain(order, client)); 
    
    */

    throw new Error('Method not implemented.');
  }

  async findManyRecentNearby(
    status: Status,
    city: string,
    neighborhood: string,
    params: PaginationParams,
  ): Promise<Order[] | null> {
    throw new Error('Method not implemented.');
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({
      data,
    });
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    });
  }
}
