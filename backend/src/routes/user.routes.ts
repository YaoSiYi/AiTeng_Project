import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', userController.list);
router.get('/levels', userController.getLevels);
router.get('/:id', userController.detail);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.get('/:id/orders', userController.getUserOrders);

export default router;
