# TPshop Refactored

TPshop 重构项目 - Vue3 + Node.js/TypeScript 全栈

## 技术栈

### 前端
- Vue 3
- Arco Design
- Vite

### 后端
- Express
- TypeScript
- Prisma

## 项目结构

```
tpshop-refactored/
├── frontend/          # Vue3 前端项目
├── backend/           # Express + TypeScript 后端项目
├── package.json       # 根目录 Monorepo 配置
└── docker-compose.yml # Docker 编排配置
```

## 快速开始

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd backend && npm install
```

### 开发模式

```bash
# 同时启动前后端
npm run dev

# 仅启动前端
npm run dev:frontend

# 仅启动后端
npm run dev:backend
```

### 构建

```bash
npm run build
```

### Docker

```bash
npm run docker:up
npm run docker:down
```

## 代码规范

```bash
npm run lint
```

## 测试

```bash
npm test
```
