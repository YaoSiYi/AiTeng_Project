#!/bin/bash

# TPshop 重构项目 - 快速启动脚本
# 使用方法: ./run.sh

echo "启动 TPshop 管理系统..."
echo ""

# 启动后端（后台运行）
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端（后台运行）
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 等待前端启动
sleep 3

# 打开浏览器
open http://localhost:3000

echo ""
echo "=========================================="
echo "  TPshop 管理系统已启动"
echo "=========================================="
echo ""
echo "访问地址: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
