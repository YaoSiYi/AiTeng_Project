import { Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { success, paginate } from '../utils/response';
import { UserListQuery } from '../types/user.types';
import { AuthRequest } from '../types/auth.types';
import { AppError } from '../utils/errors';

export class UserController {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query: UserListQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        keyword: req.query.keyword ? String(req.query.keyword) : undefined,
        isDelete: req.query.isDelete ? Number(req.query.isDelete) : undefined,
      };
      const result = await userService.list(query);
      res.json(paginate(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  async detail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('无效的用户ID', 400);
      const result = await userService.detail(id);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('无效的用户ID', 400);
      const result = await userService.update(id, req.body);
      res.json(success(result, '用户信息更新成功'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new AppError('无效的用户ID', 400);
      await userService.delete(id);
      res.json(success(null, '用户删除成功'));
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) throw new AppError('无效的用户ID', 400);
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await userService.getUserOrders(userId, page, pageSize);
      res.json(paginate(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  async getLevels(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.getLevels();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
