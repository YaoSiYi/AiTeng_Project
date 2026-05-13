import { Prisma } from '@prisma/client';
import { UserListQuery, UpdateUserRequest } from '../types/user.types';
import { AppError } from '../utils/errors';
import { prisma } from '../lib/prisma';

export class UserService {
  async list(query: UserListQuery) {
    const { page = 1, pageSize: rawPageSize = 20, keyword, isDelete = 0 } = query;
    const pageSize = Math.min(Math.max(rawPageSize, 1), 100);

    const where: Prisma.UserWhereInput = {
      isDelete,
    };

    if (keyword) {
      where.OR = [
        { nickname: { contains: keyword } },
        { mobile: { contains: keyword } },
        { email: { contains: keyword } },
      ];
    }

    const [list, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { regTime: 'desc' },
        select: {
          id: true,
          nickname: true,
          email: true,
          mobile: true,
          avatar: true,
          sex: true,
          birthday: true,
          money: true,
          payPoints: true,
          regTime: true,
          lastLogin: true,
          isDelete: true,
        },
      }),
      prisma.user.count({ where }),
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
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        email: true,
        mobile: true,
        avatar: true,
        sex: true,
        birthday: true,
        money: true,
        frozenMoney: true,
        payPoints: true,
        regTime: true,
        lastLogin: true,
        lastIp: true,
      },
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    const addresses = await prisma.userAddress.findMany({
      where: { userId: id },
      orderBy: { isDefault: 'desc' },
    });

    const orderCount = await prisma.order.count({
      where: { userId: id },
    });

    return {
      ...user,
      addresses,
      orderCount,
    };
  }

  async update(id: number, data: UpdateUserRequest) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.mobile !== undefined) updateData.mobile = data.mobile;
    if (data.sex !== undefined) updateData.sex = data.sex;
    if (data.birthday !== undefined) updateData.birthday = data.birthday;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async delete(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    await prisma.user.update({
      where: { id },
      data: { isDelete: 1 },
    });

    return true;
  }

  async getUserOrders(userId: number, page: number = 1, pageSize: number = 10) {
    const [list, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { addTime: 'desc' },
        include: {
          orderGoods: true,
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getLevels() {
    const levels = await prisma.userLevel.findMany({
      orderBy: { id: 'asc' },
    });
    return levels;
  }
}

export const userService = new UserService();
