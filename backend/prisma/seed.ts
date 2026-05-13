import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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

  console.log(adminRole.id === 1 ? 'Admin role already exists' : 'Created admin role:', adminRole.roleName);

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nickname: '管理员',
      email: adminEmail,
      roleId: 1,
      status: 1,
    },
  });

  console.log('Admin user:', admin.username);

  const userLevel = await prisma.userLevel.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      levelName: '普通会员',
      discount: 1.0,
      description: '普通会员等级',
    },
  });

  console.log(userLevel.id === 1 ? 'User level already exists' : 'Created user level:', userLevel.levelName);

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
