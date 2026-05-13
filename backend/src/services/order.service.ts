import { Prisma } from '@prisma/client';
import { OrderListQuery, UpdateOrderStatusRequest, ShipOrderRequest } from '../types/order.types';
import { AppError } from '../utils/errors';
import { prisma } from '../lib/prisma';

export class OrderService {
  async list(query: OrderListQuery) {
    const {
      page = 1,
      pageSize: rawPageSize = 20,
      orderNo,
      orderStatus,
      payStatus,
      shippingStatus,
      startDate,
      endDate,
      keyword,
    } = query;

    const pageSize = Math.min(Math.max(rawPageSize, 1), 100);

    const where: Prisma.OrderWhereInput = {};

    if (orderNo) {
      where.orderNo = { contains: orderNo };
    }

    if (orderStatus !== undefined) {
      where.orderStatus = orderStatus;
    }

    if (payStatus !== undefined) {
      where.payStatus = payStatus;
    }

    if (shippingStatus !== undefined) {
      where.shippingStatus = shippingStatus;
    }

    if (startDate || endDate) {
      where.addTime = {};
      if (startDate) {
        where.addTime.gte = Math.floor(new Date(startDate).getTime() / 1000);
      }
      if (endDate) {
        where.addTime.lte = Math.floor(new Date(endDate).getTime() / 1000);
      }
    }

    if (keyword) {
      where.OR = [
        { orderNo: { contains: keyword } },
        { consignee: { contains: keyword } },
        { mobile: { contains: keyword } },
      ];
    }

    const [list, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { addTime: 'desc' },
        include: {
          orderGoods: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async detail(id: number) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderGoods: true,
        orderActions: {
          orderBy: { logTime: 'desc' },
        },
      },
    });

    if (!order) {
      throw new AppError('订单不存在', 404);
    }

    const [user, address] = await Promise.all([
      prisma.user.findUnique({ where: { id: order.userId } }),
      prisma.userAddress.findFirst({ where: { userId: order.userId, isDefault: 1 } }),
    ]);

    return {
      ...order,
      user: user ? {
        id: user.id,
        nickname: user.nickname,
        mobile: user.mobile,
        email: user.email,
      } : null,
      address,
    };
  }

  async updateStatus(id: number, data: UpdateOrderStatusRequest, operatorId: number) {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new AppError('订单不存在', 404);
    }

    if (order.orderStatus === 2 && data.orderStatus !== undefined && data.orderStatus !== 2) {
      throw new AppError('已完成的订单不能修改状态', 400);
    }

    if (order.orderStatus === 3) {
      throw new AppError('已取消的订单不能修改状态', 400);
    }

    const updateData: Prisma.OrderUpdateInput = {};
    if (data.orderStatus !== undefined) updateData.orderStatus = data.orderStatus;
    if (data.payStatus !== undefined) updateData.payStatus = data.payStatus;
    if (data.shippingStatus !== undefined) updateData.shippingStatus = data.shippingStatus;

    if (data.payStatus === 1 && order.payStatus !== 1) {
      updateData.payTime = Math.floor(Date.now() / 1000);
    }

    const [updated] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: updateData,
      }),
      prisma.orderAction.create({
        data: {
          orderId: id,
          actionUser: operatorId,
          actionNote: data.remark || '更新订单状态',
          orderStatus: data.orderStatus ?? order.orderStatus,
          payStatus: data.payStatus ?? order.payStatus,
          shippingStatus: data.shippingStatus ?? order.shippingStatus,
          logTime: Math.floor(Date.now() / 1000),
        },
      }),
    ]);

    return updated;
  }

  async ship(id: number, data: ShipOrderRequest, operatorId: number) {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new AppError('订单不存在', 404);
    }

    if (order.shippingStatus === 1) {
      throw new AppError('订单已发货', 400);
    }

    const now = Math.floor(Date.now() / 1000);

    const [updated] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: {
          expressCode: data.expressCode,
          expressNo: data.expressNo,
          shippingName: data.shippingName,
          shippingStatus: 1,
          shippingTime: now,
        },
      }),
      prisma.orderAction.create({
        data: {
          orderId: id,
          actionUser: operatorId,
          actionNote: `已发货，快递公司：${data.shippingName}，快递单号：${data.expressNo}`,
          orderStatus: order.orderStatus,
          payStatus: order.payStatus,
          shippingStatus: 1,
          logTime: now,
        },
      }),
    ]);

    return updated;
  }

  async getStatistics() {
    const [
      totalOrders,
      pendingPayment,
      pendingShipment,
      shipped,
      completed,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { payStatus: 0, orderStatus: 0 } }),
      prisma.order.count({ where: { payStatus: 1, shippingStatus: 0 } }),
      prisma.order.count({ where: { shippingStatus: 1, orderStatus: { not: 2 } } }),
      prisma.order.count({ where: { orderStatus: 2 } }),
    ]);

    return {
      totalOrders,
      pendingPayment,
      pendingShipment,
      shipped,
      completed,
    };
  }
}

export const orderService = new OrderService();
