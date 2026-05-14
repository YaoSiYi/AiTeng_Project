#!/bin/bash

# TPshop 重构项目 - 快速演示脚本（无需数据库）
# 使用方法: ./demo.sh

echo "=========================================="
echo "  TPshop 管理系统 - 快速演示"
echo "=========================================="
echo ""
echo "此脚本启动前端演示模式，无需数据库"
echo ""

# 启动前端
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# 等待启动
sleep 3

# 打开浏览器
open http://localhost:3000

echo ""
echo "=========================================="
echo "  前端演示已启动"
echo "=========================================="
echo ""
echo "访问地址: http://localhost:3000"
echo ""
echo "注意: 此模式下后端API不可用，仅展示前端界面"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 等待用户中断
trap "kill $FRONTEND_PID 2>/dev/null; exit" INT
wait
