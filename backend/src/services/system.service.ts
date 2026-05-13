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
    const updates = Object.entries(data).map(([name, value]) => {
      return prisma.config.upsert({
        where: { name },
        update: { value },
        create: { name, value, remark: '' },
      });
    });

    await prisma.$transaction(updates);
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
      uptime: Math.floor(process.uptime()),
    };
  }
}

export const systemService = new SystemService();
