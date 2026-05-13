import { Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { success, paginate } from '../utils/response';
import { AuthRequest } from '../types/auth.types';

export class OrderController {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await orderService.list(req.query as any);
      res.json(paginate(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  async detail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await orderService.detail(id);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
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
