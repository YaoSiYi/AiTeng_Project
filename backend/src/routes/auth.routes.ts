import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, permissionMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema } from '../validators/auth.validator';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { code: 429, message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), authController.login);

router.get('/userinfo', authMiddleware, permissionMiddleware(['user:read']), authController.getUserInfo);

router.post('/logout', authMiddleware, authController.logout);

export default router;
