import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { success, paginate } from '../utils/response';
import { UserListQuery } from '../types/user.types';

export class UserController {
  async list(req: Request, res: Response, next: NextFunction) {
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

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await userService.detail(id);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await userService.update(id, req.body);
      res.json(success(result, '用户信息更新成功'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await userService.delete(id);
      res.json(success(null, '用户删除成功'));
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const result = await userService.getUserOrders(userId, page, pageSize);
      res.json(paginate(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  async getLevels(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getLevels();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
