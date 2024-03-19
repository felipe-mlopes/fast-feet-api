import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';

import { CacheRepository } from '@/infra/cache/cache-repository';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const cacheHit = await this.cacheRepository.get(`order:${id}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);

      return cachedData;
    }

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

    const questionDetails = PrismaOrderMapper.toDomain(order, client);

    await this.cacheRepository.set(
      `order:${id}:details`,
      JSON.stringify(questionDetails),
    );

    return questionDetails;
  }

  async findByTrackingCode(trackingCode: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        trackingCode,
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
            clientEmail: true,
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
            clientEmail: true,
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

    await Promise.all([
      this.prisma.order.update({
        where: {
          id: order.id.toString(),
        },
        data,
      }),

      this.cacheRepository.delete(`order:${order.id.toString()}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(order.id);
  }
}
