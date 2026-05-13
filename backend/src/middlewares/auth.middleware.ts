import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload, AuthRequest } from '../types/auth.types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未提供认证令牌',
      data: null,
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.jwt.secret as Secret) as JwtPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        code: 401,
        message: '令牌已过期',
        data: null,
      });
    }
    return res.status(401).json({
      code: 401,
      message: '无效的令牌',
      data: null,
    });
  }
};

export const permissionMiddleware = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '未认证',
        data: null,
      });
    }

    if (user.permissions && user.permissions.includes('*')) {
      return next();
    }

    const hasPermission = permissions.some((p) => user.permissions?.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        code: 403,
        message: '无权限访问',
        data: null,
      });
    }

    next();
  };
};
