import { Request, Response, NextFunction } from 'express';
import { authMiddleware, permissionMiddleware } from '../../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';

// 模拟jsonwebtoken
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should return 401 if no authorization header', () => {
      authMiddleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 401,
        message: '未提供认证令牌',
        data: null,
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header is invalid format', () => {
      mockReq.headers = { authorization: 'InvalidFormat' };

      authMiddleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token is expired', () => {
      mockReq.headers = { authorization: 'Bearer expired-token' };
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      authMiddleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 401,
        message: '令牌已过期',
        data: null,
      });
    });

    it('should return 401 if token is invalid', () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authMiddleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 401,
        message: '无效的令牌',
        data: null,
      });
    });

    it('should call next and attach user if token is valid', () => {
      const mockPayload = {
        userId: 1,
        username: 'admin',
        roleId: 1,
      };

      mockReq.headers = { authorization: 'Bearer valid-token' };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      authMiddleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect((mockReq as any).user).toEqual(mockPayload);
    });
  });

  describe('permissionMiddleware', () => {
    it('should return 401 if user is not attached', () => {
      const middleware = permissionMiddleware(['admin']);

      middleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should call next if user has wildcard permission', () => {
      (mockReq as any).user = {
        userId: 1,
        username: 'admin',
        roleId: 1,
        permissions: ['*'],
      };

      const middleware = permissionMiddleware(['admin', 'user']);

      middleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should call next if user has required permission', () => {
      (mockReq as any).user = {
        userId: 1,
        username: 'admin',
        roleId: 1,
        permissions: ['user_manage'],
      };

      const middleware = permissionMiddleware(['user_manage']);

      middleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if user does not have required permission', () => {
      (mockReq as any).user = {
        userId: 1,
        username: 'user',
        roleId: 2,
        permissions: ['user_view'],
      };

      const middleware = permissionMiddleware(['user_manage']);

      middleware(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 403,
        message: '无权限访问',
        data: null,
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
