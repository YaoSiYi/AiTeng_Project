# Windows 一键启动指南

## 快速开始

### 方法一：使用一键启动脚本（推荐）

双击运行 `start.bat` 文件，然后按照菜单提示操作：

```
==========================================
  TPshop 重构项目 - Windows一键启动脚本
==========================================

1. 运行测试（后端 + 前端）
2. 启动开发服务器（本地模式）
3. 启动开发服务器（Docker模式）
4. 运行测试并启动开发服务器
5. 仅运行后端测试
6. 仅运行前端测试
7. 退出
```

### 方法二：仅运行测试

双击运行 `test.bat` 文件，自动运行所有测试：

```
==========================================
  TPshop 重构项目 - 测试运行脚本
==========================================

[1/2] 运行后端测试...
------------------------------------------
PASS src/tests/services/auth.service.test.ts
PASS src/tests/middlewares/auth.middleware.test.ts
PASS src/tests/utils/response.test.ts
PASS src/tests/utils/errors.test.ts

Test Suites: 4 passed, 4 total
Tests:       29 passed, 29 total

[2/2] 运行前端测试...
------------------------------------------
 ✓ src/tests/stores/app.test.ts
 ✓ src/tests/utils/helpers.test.ts
 ✓ src/tests/stores/user.test.ts

 Test Files  3 passed (3)
 Tests       13 passed (13)

==========================================
  测试结果汇总
==========================================

后端测试: 通过
前端测试: 通过

==========================================
   所有测试通过！
==========================================
```

## 前置要求

### 必需软件

1. **Node.js 18+**
   - 下载地址：https://nodejs.org/
   - 安装后验证：`node --version`

2. **npm 9+**
   - 随Node.js一起安装
   - 验证：`npm --version`

### 可选软件

1. **Docker Desktop**
   - 下载地址：https://www.docker.com/products/docker-desktop
   - 用于Docker模式启动

2. **Git**
   - 下载地址：https://git-scm.com/
   - 用于版本控制

## 使用说明

### 首次使用

1. 克隆或下载项目
2. 双击运行 `start.bat`
3. 选择 "1. 运行测试" 验证环境
4. 选择 "2. 启动开发服务器" 开始开发

### 日常开发

#### 运行测试
```cmd
:: 方式1：双击运行
test.bat

:: 方式2：命令行
cd backend && npm test
cd frontend && npx vitest run
```

#### 启动开发服务器
```cmd
:: 方式1：双击运行
start.bat
选择 2

:: 方式2：命令行
cd backend && npm run dev
cd frontend && npm run dev
```

#### 提交代码
```cmd
:: 方式1：双击运行
git-commit.bat

:: 方式2：命令行
git add -A
git commit -m "your commit message"
git push
```

## 访问地址

启动开发服务器后：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | http://localhost:3000 | Vue3管理界面 |
| 后端API | http://localhost:4000 | Express API |
| 健康检查 | http://localhost:4000/health | 服务状态 |

## 测试覆盖

### 后端测试（29个）

| 测试套件 | 测试数 | 说明 |
|----------|--------|------|
| auth.service.test.ts | 7 | 认证服务测试 |
| auth.middleware.test.ts | 9 | 认证中间件测试 |
| response.test.ts | 8 | 响应工具测试 |
| errors.test.ts | 5 | 错误处理测试 |

### 前端测试（13个）

| 测试套件 | 测试数 | 说明 |
|----------|--------|------|
| app.test.ts | 3 | App Store测试 |
| user.test.ts | 3 | User Store测试 |
| helpers.test.ts | 7 | 工具函数测试 |

## 常见问题

### Q: 运行脚本时提示"不是内部或外部命令"

A: 确保已安装Node.js，并且npm已添加到系统PATH。

### Q: 后端测试失败

A: 检查以下几点：
1. Node.js版本是否为18+
2. 是否在项目根目录运行
3. 网络连接是否正常（需要下载依赖）

### Q: 前端测试失败

A: 检查以下几点：
1. 是否已安装所有依赖
2. TypeScript版本是否兼容
3. 查看错误信息定位问题

### Q: Docker模式启动失败

A: 检查以下几点：
1. Docker Desktop是否已启动
2. 端口是否被占用
3. 查看Docker日志：`docker-compose logs`

### Q: 如何查看测试覆盖率

A: 运行以下命令：
```cmd
:: 后端
cd backend && npm run test:coverage

:: 前端
cd frontend && npx vitest run --coverage
```

## 脚本说明

| 脚本文件 | 功能 |
|----------|------|
| `start.bat` | 一键启动脚本（测试+启动） |
| `test.bat` | 仅运行测试 |
| `git-commit.bat` | 一键提交代码 |
| `GIT_COMMIT_GUIDE.md` | Git提交指南 |

## 开发建议

1. **提交前运行测试**：确保代码质量
2. **使用有意义的提交信息**：便于追踪更改
3. **定期拉取最新代码**：避免代码冲突
4. **查看测试覆盖率**：确保代码质量

## 相关文档

- [Git提交指南](GIT_COMMIT_GUIDE.md)
- [项目README](README.md)
- [PRD文档](aiteng_os_prd.md)

## 技术支持

如遇到问题，请：
1. 查看控制台错误信息
2. 检查Node.js和npm版本
3. 查看项目文档
4. 提交Issue到GitHub
