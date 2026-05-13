import { Router } from 'express';
import { systemController } from '../controllers/system.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/config', systemController.getConfig);
router.put('/config', systemController.updateConfig);
router.get('/plugins', systemController.getPlugins);
router.put('/plugins/:code', systemController.updatePluginConfig);
router.get('/info', systemController.getSystemInfo);

export default router;
