import { AuthService } from '../../services/auth.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 模拟依赖
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// 创建模拟对象
const mockAdminFindUnique = jest.fn();
const mockAdminUpdate = jest.fn();
const mockAdminRoleFindUnique = jest.fn();

// 模拟 Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    admin: {
      findUnique: (...args: any[]) => mockAdminFindUnique(...args),
      update: (...args: any[]) => mockAdminUpdate(...args),
    },
    adminRole: {
      findUnique: (...args: any[]) => mockAdminRoleFindUnique(...args),
    },
  },
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockAdmin = {
      id: 1,
      username: 'admin',
      password: 'hashed-password',
      nickname: '管理员',
      email: 'admin@example.com',
      avatar: null,
      roleId: 1,
      status: 1,
    };

    it('should login successfully with valid credentials', async () => {
      // 模拟数据库查询
      mockAdminFindUnique.mockResolvedValue(mockAdmin);
      
      // 模拟密码验证
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      // 模拟JWT生成
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');
      
      // 模拟更新最后登录时间
      mockAdminUpdate.mockResolvedValue(mockAdmin);

      const result = await authService.login({
        username: 'admin',
        password: 'admin123',
      });

      expect(result).toHaveProperty('token', 'mock-token');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('admin');
      expect(mockAdminFindUnique).toHaveBeenCalledWith({
        where: { username: 'admin' },
      });
    });

    it('should throw error for non-existent user', async () => {
      mockAdminFindUnique.mockResolvedValue(null);

      await expect(
        authService.login({ username: 'nonexistent', password: 'password' })
      ).rejects.toThrow('用户名或密码错误');
    });

    it('should throw error for disabled account', async () => {
      const disabledAdmin = { ...mockAdmin, status: 0 };
      mockAdminFindUnique.mockResolvedValue(disabledAdmin);

      await expect(
        authService.login({ username: 'admin', password: 'admin123' })
      ).rejects.toThrow('账号已被禁用');
    });

    it('should throw error for wrong password', async () => {
      mockAdminFindUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ username: 'admin', password: 'wrong-password' })
      ).rejects.toThrow('用户名或密码错误');
    });
  });

  describe('getUserInfo', () => {
    const mockAdmin = {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      email: 'admin@example.com',
      mobile: '13800138000',
      avatar: null,
      roleId: 1,
    };

    const mockRole = {
      id: 1,
      roleName: '超级管理员',
      permissions: '["*"]',
    };

    it('should return user info successfully', async () => {
      const adminWithRole = {
        ...mockAdmin,
        role: mockRole,
      };
      mockAdminFindUnique.mockResolvedValue(adminWithRole);

      const result = await authService.getUserInfo(1);

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('username', 'admin');
      expect(result).toHaveProperty('roleName', '超级管理员');
      expect(result).toHaveProperty('permissions', ['*']);
    });

    it('should throw error for non-existent user', async () => {
      mockAdminFindUnique.mockResolvedValue(null);

      await expect(authService.getUserInfo(999)).rejects.toThrow('用户不存在');
    });

    it('should handle missing role', async () => {
      mockAdminFindUnique.mockResolvedValue(mockAdmin);
      mockAdminRoleFindUnique.mockResolvedValue(null);

      const result = await authService.getUserInfo(1);

      expect(result.roleName).toBe('');
      expect(result.permissions).toEqual([]);
    });
  });
});
