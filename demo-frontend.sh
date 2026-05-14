#!/bin/bash

# TPshop 重构项目 - 前端演示模式
# 无需数据库，仅展示前端界面

echo "=========================================="
echo "  TPshop 管理系统 - 前端演示模式"
echo "=========================================="
echo ""
echo "此模式无需数据库，仅展示前端界面"
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
echo "登录页面会显示，但无法实际登录（需要后端）"
echo ""
echo "您可以："
echo "  - 查看登录界面设计"
echo "  - 查看路由和页面结构"
echo "  - 查看UI组件样式"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 等待用户中断
trap "kill $FRONTEND_PID 2>/dev/null; exit" INT
wait
