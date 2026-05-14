#!/bin/bash

# TPshop 重构项目 - Mac一键启动脚本
# 使用方法: ./start-mac.sh

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  TPshop 重构项目 - Mac一键启动脚本"
echo "=========================================="
echo ""

# 检查Node.js
echo -e "${GREEN}[检查]${NC} 检查Node.js安装..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}[错误]${NC} 未安装Node.js，请先安装Node.js 18+"
    echo "安装命令: brew install node"
    exit 1
fi
echo -e "${GREEN}[成功]${NC} Node.js版本: $(node --version)"

# 检查npm
echo -e "${GREEN}[检查]${NC} 检查npm安装..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[错误]${NC} 未安装npm"
    exit 1
fi
echo -e "${GREEN}[成功]${NC} npm版本: $(npm --version)"

echo ""
echo "=========================================="
echo "  选择启动模式"
echo "=========================================="
echo ""
echo "1. 运行测试"
echo "2. 启动开发服务器（本地模式）"
echo "3. 运行测试并启动开发服务器"
echo "4. 仅运行后端测试"
echo "5. 仅运行前端测试"
echo "6. 退出"
echo ""
read -p "请选择 (1-6): " choice

case $choice in
    1)
        echo ""
        echo "=========================================="
        echo "  运行测试"
        echo "=========================================="
        echo ""
        
        # 后端测试
        echo -e "${GREEN}[测试]${NC} 运行后端测试..."
        cd backend
        npm install --silent
        npm test
        cd ..
        
        # 前端测试
        echo ""
        echo -e "${GREEN}[测试]${NC} 运行前端测试..."
        cd frontend
        npm install --silent
        npx vitest run
        cd ..
        
        echo ""
        echo -e "${GREEN}[完成]${NC} 所有测试通过！"
        ;;
    2)
        echo ""
        echo "=========================================="
        echo "  启动开发服务器"
        echo "=========================================="
        echo ""
        
        # 检查环境变量
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}[警告]${NC} 未找到.env文件，正在从示例创建..."
            cp .env.example .env
            echo -e "${GREEN}[成功]${NC} 已创建.env文件"
        fi
        
        # 启动后端
        echo -e "${GREEN}[启动]${NC} 启动后端服务器..."
        cd backend
        npm install --silent
        npm run dev &
        BACKEND_PID=$!
        cd ..
        
        # 等待后端启动
        echo -e "${GREEN}[等待]${NC} 等待后端服务器启动..."
        sleep 5
        
        # 启动前端
        echo -e "${GREEN}[启动]${NC} 启动前端服务器..."
        cd frontend
        npm install --silent
        npm run dev &
        FRONTEND_PID=$!
        cd ..
        
        # 等待前端启动
        sleep 3
        
        # 打开浏览器
        echo -e "${GREEN}[打开]${NC} 正在打开浏览器..."
        open http://localhost:3000
        
        echo ""
        echo -e "${GREEN}[完成]${NC} 开发服务器已启动！"
        echo ""
        echo "访问地址："
        echo "  - 前端: http://localhost:3000"
        echo "  - 后端API: http://localhost:4000"
        echo "  - 健康检查: http://localhost:4000/health"
        echo ""
        echo "按 Ctrl+C 停止服务器"
        
        # 等待用户中断
        trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
        wait
        ;;
    3)
        echo ""
        echo "=========================================="
        echo "  运行测试并启动开发服务器"
        echo "=========================================="
        echo ""
        
        # 运行测试
        echo -e "${GREEN}[测试]${NC} 运行后端测试..."
        cd backend
        npm install --silent
        npm test
        cd ..
        
        echo -e "${GREEN}[测试]${NC} 运行前端测试..."
        cd frontend
        npm install --silent
        npx vitest run
        cd ..
        
        echo ""
        echo -e "${GREEN}[启动]${NC} 启动开发服务器..."
        
        # 检查环境变量
        if [ ! -f ".env" ]; then
            cp .env.example .env
        fi
        
        # 启动服务器
        cd backend
        npm run dev &
        BACKEND_PID=$!
        cd ..
        
        sleep 5
        
        cd frontend
        npm run dev &
        FRONTEND_PID=$!
        cd ..
        
        sleep 3
        
        # 打开浏览器
        open http://localhost:3000
        
        echo ""
        echo -e "${GREEN}[完成]${NC} 测试通过，服务器已启动！"
        echo ""
        echo "按 Ctrl+C 停止服务器"
        
        trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
        wait
        ;;
    4)
        echo ""
        echo -e "${GREEN}[测试]${NC} 运行后端测试..."
        cd backend
        npm install --silent
        npm test
        cd ..
        ;;
    5)
        echo ""
        echo -e "${GREEN}[测试]${NC} 运行前端测试..."
        cd frontend
        npm install --silent
        npx vitest run
        cd ..
        ;;
    6)
        echo "退出"
        exit 0
        ;;
    *)
        echo -e "${RED}[错误]${NC} 无效选择"
        exit 1
        ;;
esac
