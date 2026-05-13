import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errors';

export class SystemService {
  async getConfig() {
    const configs = await prisma.config.findMany();

    const configMap: Record<string, string> = {};
    configs.forEach((item) => {
      configMap[item.name] = item.value;
    });

    return configMap;
  }

  async updateConfig(data: Record<string, string>) {
    const updates = Object.entries(data).map(async ([name, value]) => {
      const existing = await prisma.config.findFirst({
        where: { name },
      });

      if (existing) {
        return prisma.config.update({
          where: { id: existing.id },
          data: { value },
        });
      } else {
        return prisma.config.create({
          data: { name, value, remark: '' },
        });
      }
    });

    await Promise.all(updates);
    return true;
  }

  async getPlugins() {
    const plugins = await prisma.plugin.findMany({
      orderBy: { code: 'asc' },
    });
    return plugins;
  }

  async updatePluginConfig(code: string, config: Record<string, any>) {
    const plugin = await prisma.plugin.findUnique({
      where: { code },
    });

    if (!plugin) {
      throw new AppError('插件不存在', 404);
    }

    await prisma.plugin.update({
      where: { code },
      data: { config: JSON.stringify(config) },
    });

    return true;
  }

  async getSystemInfo() {
    const [adminCount, userCount, goodsCount, orderCount] = await Promise.all([
      prisma.admin.count(),
      prisma.user.count({ where: { isDelete: 0 } }),
      prisma.goods.count({ where: { isDelete: 0 } }),
      prisma.order.count(),
    ]);

    return {
      adminCount,
      userCount,
      goodsCount,
      orderCount,
      version: '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
    };
  }
}

export const systemService = new SystemService();
