import { Request, Response, NextFunction } from 'express';
import { systemService } from '../services/system.service';
import { success } from '../utils/response';

export class SystemController {
  async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await systemService.getConfig();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      await systemService.updateConfig(req.body);
      res.json(success(null, '配置更新成功'));
    } catch (error) {
      next(error);
    }
  }

  async getPlugins(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await systemService.getPlugins();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async updatePluginConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      await systemService.updatePluginConfig(code, req.body);
      res.json(success(null, '插件配置更新成功'));
    } catch (error) {
      next(error);
    }
  }

  async getSystemInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await systemService.getSystemInfo();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export const systemController = new SystemController();
