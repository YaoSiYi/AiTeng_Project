import { Router } from 'express';
import { systemController } from '../controllers/system.controller';
import { authMiddleware, permissionMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateConfigSchema, updatePluginConfigSchema } from '../validators/system.validator';

const router = Router();

router.use(authMiddleware);

router.get('/config', systemController.getConfig);
router.put('/config', permissionMiddleware(['system_manage']), validate(updateConfigSchema), systemController.updateConfig);
router.get('/plugins', systemController.getPlugins);
router.put('/plugins/:code', permissionMiddleware(['system_manage']), validate(updatePluginConfigSchema), systemController.updatePluginConfig);
router.get('/info', systemController.getSystemInfo);

export default router;
