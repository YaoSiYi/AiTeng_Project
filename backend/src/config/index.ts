import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const isProd = process.env.APP_ENV === 'production';

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    if (isProd) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return '';
  }
  return value;
};

export const config = {
  app: {
    port: parseInt(process.env.APP_PORT || '4000', 10),
    env: process.env.APP_ENV || 'development',
    isDev: process.env.APP_ENV === 'development',
    isProd,
  },
  db: {
    url: requireEnv('DATABASE_URL'),
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || 'logs',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
};
