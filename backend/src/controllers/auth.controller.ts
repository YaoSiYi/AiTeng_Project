import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { success } from '../utils/response';
import { AuthRequest } from '../types/auth.types';

export class AuthController {
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(success(result, '登录成功'));
    } catch (error) {
      next(error);
    }
  }

  async getUserInfo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.getUserInfo(req.user!.userId);
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  // Note: JWT tokens remain valid until expiry. This endpoint only clears client-side state.
  // For server-side invalidation, implement a token blacklist (e.g. Redis-based).
  async logout(_req: AuthRequest, res: Response) {
    res.json(success(null, '登出成功'));
  }
}

export const authController = new AuthController();
