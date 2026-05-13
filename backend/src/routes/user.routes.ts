import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware, permissionMiddleware } from '../middlewares/auth.middleware';
import { validate, validateQuery } from '../middlewares/validation.middleware';
import { userListQuerySchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', validateQuery(userListQuerySchema), userController.list);
router.get('/levels', userController.getLevels);
router.get('/:id', userController.detail);
router.put('/:id', permissionMiddleware(['user_manage']), validate(updateUserSchema), userController.update);
router.delete('/:id', permissionMiddleware(['user_manage']), userController.delete);
router.get('/:id/orders', userController.getUserOrders);

export default router;
