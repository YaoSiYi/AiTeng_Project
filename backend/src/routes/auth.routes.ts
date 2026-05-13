import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware, permissionMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);

router.get('/userinfo', authMiddleware, permissionMiddleware(['user:read']), authController.getUserInfo);

router.post('/logout', authMiddleware, authController.logout);

export default router;
