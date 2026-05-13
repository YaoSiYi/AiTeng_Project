export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    nickname: string | null;
    email: string | null;
    avatar: string | null;
    roleId: number;
  };
}

export interface JwtPayload {
  userId: number;
  username: string;
  roleId: number;
  permissions?: string[];
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
