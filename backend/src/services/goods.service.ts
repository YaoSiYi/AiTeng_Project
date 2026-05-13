import { PrismaClient, Prisma } from '@prisma/client';
import { GoodsListQuery, CreateGoodsRequest, UpdateGoodsRequest } from '../types/goods.types';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

export class GoodsService {
  async list(query: GoodsListQuery) {
    const { page = 1, pageSize = 20, keyword, categoryId, brandId, isOnSale } = query;

    const where: Prisma.GoodsWhereInput = {
      isDelete: 0,
    };

    if (keyword) {
      where.OR = [
        { goodsName: { contains: keyword } },
        { goodsSn: { contains: keyword } },
        { keywords: { contains: keyword } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (isOnSale !== undefined) {
      where.isOnSale = isOnSale;
    }

    const [list, total] = await Promise.all([
      prisma.goods.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.goods.count({ where }),
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
    const goods = await prisma.goods.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!goods || goods.isDelete === 1) {
      throw new AppError('商品不存在', 404);
    }

    return goods;
  }

  async create(data: CreateGoodsRequest) {
    const goods = await prisma.goods.create({
      data: {
        ...data,
        lastUpdate: Math.floor(Date.now() / 1000),
      },
    });

    return goods;
  }

  async update(id: number, data: UpdateGoodsRequest) {
    const goods = await prisma.goods.findUnique({
      where: { id },
    });

    if (!goods || goods.isDelete === 1) {
      throw new AppError('商品不存在', 404);
    }

    const updated = await prisma.goods.update({
      where: { id },
      data: {
        ...data,
        lastUpdate: Math.floor(Date.now() / 1000),
      },
    });

    return updated;
  }

  async delete(id: number) {
    const goods = await prisma.goods.findUnique({
      where: { id },
    });

    if (!goods || goods.isDelete === 1) {
      throw new AppError('商品不存在', 404);
    }

    await prisma.goods.update({
      where: { id },
      data: { isDelete: 1 },
    });

    return true;
  }

  async updateOnSale(id: number, isOnSale: number) {
    const goods = await prisma.goods.findUnique({
      where: { id },
    });

    if (!goods || goods.isDelete === 1) {
      throw new AppError('商品不存在', 404);
    }

    await prisma.goods.update({
      where: { id },
      data: { isOnSale },
    });

    return true;
  }
}

export const goodsService = new GoodsService();
