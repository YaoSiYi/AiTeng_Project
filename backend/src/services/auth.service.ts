import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../config';
import { LoginRequest, LoginResponse, JwtPayload } from '../types/auth.types';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

export class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { username, password } = data;

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new AppError('用户名或密码错误', 401);
    }

    if (admin.status !== 1) {
      throw new AppError('账号已被禁用', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError('用户名或密码错误', 401);
    }

    const role = await prisma.adminRole.findUnique({
      where: { id: admin.roleId },
    });

    let permissions: string[] = [];
    try {
      permissions = role?.permissions ? JSON.parse(role.permissions) : [];
    } catch {
      permissions = [];
    }

    const payload: JwtPayload = {
      userId: admin.id,
      username: admin.username,
      roleId: admin.roleId,
      permissions,
    };

    const token = jwt.sign(payload, config.jwt.secret as Secret, {
      expiresIn: config.jwt.expiresIn as unknown as jwt.SignOptions['expiresIn'],
    });

    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: Math.floor(Date.now() / 1000) },
    });

    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        email: admin.email,
        avatar: admin.avatar,
        roleId: admin.roleId,
      },
    };
  }

  async getUserInfo(userId: number) {
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!admin) {
      throw new AppError('用户不存在', 404);
    }

    let permissions: string[] = [];
    try {
      permissions = admin.role?.permissions ? JSON.parse(admin.role.permissions) : [];
    } catch {
      permissions = [];
    }

    return {
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname,
      email: admin.email,
      mobile: admin.mobile,
      avatar: admin.avatar,
      roleId: admin.roleId,
      roleName: admin.role?.roleName || '',
      permissions,
    };
  }
}

export const authService = new AuthService();
