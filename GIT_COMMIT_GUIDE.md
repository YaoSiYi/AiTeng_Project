# TPshop 重构项目 - 一键提交指南

## 快速开始

### Windows 用户

双击运行 `git-commit.bat` 文件，或在命令行中执行：

```cmd
git-commit.bat
```

带自定义提交信息：

```cmd
git-commit.bat "feat: 添加新功能"
```

### Mac/Linux 用户

在终端中执行：

```bash
# 添加执行权限（首次使用）
chmod +x scripts/git-commit.sh

# 运行脚本
./scripts/git-commit.sh

# 带自定义提交信息
./scripts/git-commit.sh "feat: 添加新功能"
```

## 脚本功能

### 自动提交信息

如果不提供提交信息，脚本会根据更改内容自动生成：

- `feat: 更新功能 - 时间戳` - 检测到功能相关更改
- `fix: 修复问题 - 时间戳` - 检测到修复相关更改
- `docs: 更新文档 - 时间戳` - 检测到文档相关更改
- `style: 更新样式 - 时间戳` - 检测到样式相关更改
- `refactor: 重构代码 - 时间戳` - 检测到重构相关更改
- `test: 更新测试 - 时间戳` - 检测到测试相关更改
- `chore: 更新配置 - 时间戳` - 其他更改

### 执行流程

1. 检查是否在Git仓库中
2. 检查是否有未提交的更改
3. 生成或使用提供的提交信息
4. 添加所有更改 (`git add -A`)
5. 提交更改 (`git commit`)
6. 推送到远程仓库 (`git push`)
7. 显示提交统计

### 输出示例

```
==========================================
  TPshop 重构项目 - 一键提交脚本
==========================================

[INFO] 添加所有更改...
[INFO] 提交更改: feat: 更新功能 - 2026-05-14 10:30:00
[INFO] 提交成功 ✓
[INFO] 推送到远程仓库 (分支: feature/tpshop-refactor)...
[INFO] 推送成功 ✓

[INFO] === 提交统计 ===
分支: feature/tpshop-refactor
最新提交: a1b2c3d feat: 更新功能
提交数量: 39
远程仓库: git@github.com:YaoSiYi/AiTeng_Project.git

[INFO] 所有操作完成！
```

## 常见问题

### Q: 提示"当前目录不是Git仓库"

A: 请确保在项目根目录下运行脚本，该目录应包含 `.git` 文件夹。

### Q: 提示"没有检测到更改"

A: 所有更改都已提交，无需再次提交。

### Q: 推送失败

A: 可能的原因：
- 未配置远程仓库
- 网络连接问题
- 权限不足

解决方案：
```bash
# 检查远程仓库配置
git remote -v

# 添加远程仓库（如果未配置）
git remote add origin <仓库URL>

# 使用SSH协议（推荐）
git remote set-url origin git@github.com:用户名/仓库名.git
```

### Q: 如何取消提交？

A: 如果提交后发现问题：
```bash
# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃更改）
git reset --hard HEAD~1
```

## 高级用法

### 自定义提交信息格式

编辑脚本文件，修改 `get_commit_message` 函数中的逻辑。

### 添加代码检查

取消注释脚本中的 `run_checks` 调用，启用TypeScript编译检查。

### 集成到IDE

#### VS Code

1. 打开命令面板 (`Ctrl+Shift+P`)
2. 输入 "Tasks: Configure Task"
3. 选择 "Create tasks.json file from template"
4. 添加以下配置：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Git Commit",
      "type": "shell",
      "command": "./scripts/git-commit.sh",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": []
    }
  ]
}
```

#### WebStorm/IntelliJ

1. 打开 "File" > "Settings" > "Tools" > "External Tools"
2. 点击 "+" 添加新工具
3. 配置：
   - Name: Git Commit
   - Program: $ProjectFileDir$/scripts/git-commit.sh
   - Working directory: $ProjectFileDir$

## 注意事项

1. **首次使用前**：确保已配置Git用户信息
   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱"
   ```

2. **SSH密钥**：如果使用SSH协议，确保已配置SSH密钥
   ```bash
   # 生成SSH密钥
   ssh-keygen -t rsa -b 4096 -C "你的邮箱"
   
   # 添加到SSH代理
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_rsa
   ```

3. **分支管理**：建议在feature分支上开发，通过Pull Request合并到main分支

4. **提交规范**：遵循Conventional Commits规范
   - `feat:` 新功能
   - `fix:` 修复bug
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 代码重构
   - `test:` 测试相关
   - `chore:` 构建/工具相关

## 相关链接

- [Git官方文档](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub SSH配置](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
