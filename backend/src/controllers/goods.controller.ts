import { Request, Response, NextFunction } from 'express';
import { goodsService } from '../services/goods.service';
import { success, paginate } from '../utils/response';
import { GoodsListQuery } from '../types/goods.types';

export class GoodsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query: GoodsListQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        keyword: req.query.keyword ? String(req.query.keyword) : undefined,
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
        brandId: req.query.brandId ? Number(req.query.brandId) : undefined,
        isOnSale: req.query.isOnSale ? Number(req.query.isOnSale) : undefined,
      };
      const result = await goodsService.list(query);
      res.json(paginate(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await goodsService.detail(id);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await goodsService.create(req.body);
      res.json(success(result, '商品创建成功'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await goodsService.update(id, req.body);
      res.json(success(result, '商品更新成功'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await goodsService.delete(id);
      res.json(success(null, '商品删除成功'));
    } catch (error) {
      next(error);
    }
  }

  async updateOnSale(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const { isOnSale } = req.body;
      await goodsService.updateOnSale(id, isOnSale);
      res.json(success(null, '状态更新成功'));
    } catch (error) {
      next(error);
    }
  }
}

export const goodsController = new GoodsController();
