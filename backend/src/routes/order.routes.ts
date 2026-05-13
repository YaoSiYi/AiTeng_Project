import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateOrderStatusSchema, shipOrderSchema } from '../validators/order.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', orderController.list);
router.get('/statistics', orderController.statistics);
router.get('/:id', orderController.detail);
router.put('/:id/status', validate(updateOrderStatusSchema), orderController.updateStatus);
router.post('/:id/ship', validate(shipOrderSchema), orderController.ship);

export default router;
