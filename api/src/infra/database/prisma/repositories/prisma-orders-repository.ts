import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { Order, Status } from '@/domain/delivery/enterprise/entities/order';

@Injectable()
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
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          equals: status as unknown as $Enums.Status,
        },
        deliverymanId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        shipping: {
          select: {
            id: true,
            clientName: true,
            clientCity: true,
            clientNeighborhood: true,
            clientAddress: true,
            clientZipcode: true,
          },
        },
      },
    });

    return orders.map((order) =>
      PrismaOrderMapper.toDomain(order, order.shipping),
    );
  }

  async findManyRecentByCityAndOrdersWaitingAndPicknUp(
    city: string,
    { page }: PaginationParams,
  ): Promise<Order[] | null> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          not: 'DONE',
        },
        shipping: {
          clientCity: city,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        shipping: {
          select: {
            id: true,
            clientName: true,
            clientCity: true,
            clientNeighborhood: true,
            clientAddress: true,
            clientZipcode: true,
          },
        },
      },
    });

    return orders.map((order) =>
      PrismaOrderMapper.toDomain(order, order.shipping),
    );
  }

  async findManyRecentByCityAndOrdersDone(
    city: string,
    { page }: PaginationParams,
  ): Promise<Order[] | null> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          equals: 'DONE',
        },
        shipping: {
          clientCity: city,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        shipping: {
          select: {
            id: true,
            clientName: true,
            clientCity: true,
            clientNeighborhood: true,
            clientAddress: true,
            clientZipcode: true,
          },
        },
      },
    });

    return orders.map((order) =>
      PrismaOrderMapper.toDomain(order, order.shipping),
    );
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
