#!/bin/bash

# TPshop 重构项目 - 一键提交脚本
# 使用方法: ./scripts/git-commit.sh "提交信息"

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否在Git仓库中
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "当前目录不是Git仓库"
        exit 1
    fi
}

# 检查是否有未提交的更改
check_changes() {
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        print_warn "没有检测到更改"
        exit 0
    fi
}

# 获取提交信息
get_commit_message() {
    if [ -z "$1" ]; then
        # 自动生成提交信息
        local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        local branch=$(git branch --show-current)
        local changes=$(git diff --stat)
        
        # 分析更改类型
        if echo "$changes" | grep -q "feat\|feature"; then
            echo "feat: 更新功能 - $timestamp"
        elif echo "$changes" | grep -q "fix\|bug"; then
            echo "fix: 修复问题 - $timestamp"
        elif echo "$changes" | grep -q "docs\|doc"; then
            echo "docs: 更新文档 - $timestamp"
        elif echo "$changes" | grep -q "style\|css"; then
            echo "style: 更新样式 - $timestamp"
        elif echo "$changes" | grep -q "refactor"; then
            echo "refactor: 重构代码 - $timestamp"
        elif echo "$changes" | grep -q "test"; then
            echo "test: 更新测试 - $timestamp"
        elif echo "$changes" | grep -q "chore\|config"; then
            echo "chore: 更新配置 - $timestamp"
        else
            echo "chore: 代码更新 - $timestamp"
        fi
    else
        echo "$1"
    fi
}

# 运行代码检查
run_checks() {
    print_info "运行代码检查..."
    
    # 检查TypeScript编译
    if [ -f "backend/package.json" ]; then
        print_info "检查后端TypeScript编译..."
        cd backend && npm run typecheck && cd ..
    fi
    
    if [ -f "frontend/package.json" ]; then
        print_info "检查前端TypeScript编译..."
        cd frontend && npx vue-tsc --noEmit && cd ..
    fi
    
    print_info "代码检查通过 ✓"
}

# 提交更改
commit_changes() {
    local commit_msg="$1"
    
    print_info "添加所有更改..."
    git add -A
    
    print_info "提交更改: $commit_msg"
    git commit -m "$commit_msg"
    
    print_info "提交成功 ✓"
}

# 推送到远程仓库
push_changes() {
    local current_branch=$(git branch --show-current)
    
    print_info "推送到远程仓库 (分支: $current_branch)..."
    git push origin "$current_branch"
    
    print_info "推送成功 ✓"
}

# 显示提交统计
show_stats() {
    echo ""
    print_info "=== 提交统计 ==="
    echo "分支: $(git branch --show-current)"
    echo "最新提交: $(git log -1 --pretty=format:'%h %s')"
    echo "提交数量: $(git rev-list --count HEAD)"
    echo "远程仓库: $(git remote get-url origin 2>/dev/null || echo '未配置')"
    echo ""
}

# 主函数
main() {
    echo "=========================================="
    echo "  TPshop 重构项目 - 一键提交脚本"
    echo "=========================================="
    echo ""
    
    # 检查Git仓库
    check_git_repo
    
    # 获取提交信息
    local commit_msg=$(get_commit_message "$1")
    
    # 运行代码检查（可选，取消注释启用）
    # run_checks
    
    # 提交更改
    commit_changes "$commit_msg"
    
    # 推送到远程仓库
    push_changes
    
    # 显示统计
    show_stats
    
    print_info "所有操作完成！"
}

# 执行主函数
main "$@"
