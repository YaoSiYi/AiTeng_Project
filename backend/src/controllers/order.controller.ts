import { Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { success, paginate } from '../utils/response';
import { AuthRequest } from '../types/auth.types';
import { OrderListQuery } from '../types/order.types';
import { AppError } from '../utils/errors';

export class OrderController {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query: OrderListQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        orderNo: req.query.orderNo ? String(req.query.orderNo) : undefined,
        orderStatus: req.query.orderStatus ? Number(req.query.orderStatus) : undefined,
        payStatus: req.query.payStatus ? Number(req.query.payStatus) : undefined,
        shippingStatus: req.query.shippingStatus ? Number(req.query.shippingStatus) : undefined,
        startDate: req.query.startDate ? String(req.query.startDate) : undefined,
        endDate: req.query.endDate ? String(req.query.endDate) : undefined,
        keyword: req.query.keyword ? String(req.query.keyword) : undefined,
      };
      const result = await orderService.list(query);
      res.json(paginate(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  async detail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('无效的订单ID', 400);
      const result = await orderService.detail(id);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('无效的订单ID', 400);
      const operatorId = req.user!.userId;
      const result = await orderService.updateStatus(id, req.body, operatorId);
      res.json(success(result, '订单状态更新成功'));
    } catch (error) {
      next(error);
    }
  }

  async ship(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('无效的订单ID', 400);
      const operatorId = req.user!.userId;
      const result = await orderService.ship(id, req.body, operatorId);
      res.json(success(result, '发货成功'));
    } catch (error) {
      next(error);
    }
  }

  async statistics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await orderService.getStatistics();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
