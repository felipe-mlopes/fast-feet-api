import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';

import { CacheRepository } from '@/infra/cache/cache-repository';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';
import { PrismaOrderDetailsMapper } from '../mappers/prisma-order-details-mapper';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return null;
    }

    const questionDetails = PrismaOrderMapper.toDomain(order);

    return questionDetails;
  }

  async findDetailsById(id: string): Promise<Order | null> {
    const cacheHit = await this.cacheRepository.get(`order:${id}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);

      return cachedData;
    }

    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        shipping: true,
        attachment: true,
      },
    });

    if (!order) {
      return null;
    }

    if (!order.clientId) {
      throw new Error('Order is missing recipient information');
    }

    const orderDetails = PrismaOrderDetailsMapper.toDomain(order);

    await this.cacheRepository.set(
      `order:${id}:details`,
      JSON.stringify(orderDetails),
    );

    return orderDetails;
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

    return PrismaOrderMapper.toDomain(order);
  }

  async findManyRecentByCityAndOrdersWaitingAndPicknUp(
    city: string,
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<Order[] | null> {
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          {
            AND: [
              { shipping: { clientCity: city } },
              { status: { equals: 'WAITING' } },
            ],
          },
          {
            AND: [
              { deliverymanId },
              { shipping: { clientCity: city } },
              { status: { equals: 'PICKN_UP' } },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        shipping: true,
      },
    });

    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }

  async findManyRecentByCityAndOrdersDone(
    city: string,
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<Order[] | null> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          equals: 'DONE',
        },
        deliverymanId,
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
        shipping: true,
      },
    });

    return orders.map((order) => PrismaOrderMapper.toDomain(order));
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
