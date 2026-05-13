import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 创建默认管理员角色
  const adminRole = await prisma.adminRole.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      roleName: '超级管理员',
      permissions: JSON.stringify(['*']),
      description: '拥有所有权限',
    },
  });

  console.log('Created admin role:', adminRole);

  // 创建默认管理员
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nickname: '管理员',
      email: 'admin@example.com',
      roleId: 1,
      status: 1,
    },
  });

  console.log('Created admin user:', admin);

  // 创建默认用户等级
  const userLevel = await prisma.userLevel.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      levelName: '普通会员',
      minPoints: 0,
      maxPoints: 1000,
      discount: 1,
      description: '普通会员等级',
    },
  });

  console.log('Created user level:', userLevel);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
