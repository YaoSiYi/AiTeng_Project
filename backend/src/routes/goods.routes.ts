import { Router } from 'express';
import { goodsController } from '../controllers/goods.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createGoodsSchema, updateGoodsSchema } from '../validators/goods.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', goodsController.list);

router.get('/:id', goodsController.detail);

router.post('/', validate(createGoodsSchema), goodsController.create);

router.put('/:id', validate(updateGoodsSchema), goodsController.update);

router.delete('/:id', goodsController.delete);

router.patch('/:id/on-sale', goodsController.updateOnSale);

export default router;
