@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo   TPshop 重构项目 - Windows一键启动脚本
echo ==========================================
echo.

:: 颜色定义
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

:: 检查Node.js
echo %GREEN%[检查]%NC% 检查Node.js安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[错误]%NC% 未安装Node.js，请先安装Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo %GREEN%[成功]%NC% Node.js版本: %%i

:: 检查npm
echo %GREEN%[检查]%NC% 检查npm安装...
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[错误]%NC% 未安装npm
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo %GREEN%[成功]%NC% npm版本: %%i

:: 检查Docker（可选）
echo %GREEN%[检查]%NC% 检查Docker安装...
docker --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[警告]%NC% 未安装Docker，将使用本地开发模式
    set "USE_DOCKER=false"
) else (
    echo %GREEN%[成功]%NC% Docker已安装
    set "USE_DOCKER=true"
)

echo.
echo ==========================================
echo   选择启动模式
echo ==========================================
echo.
echo 1. 运行测试（后端 + 前端）
echo 2. 启动开发服务器（本地模式）
echo 3. 启动开发服务器（Docker模式）
echo 4. 运行测试并启动开发服务器
echo 5. 仅运行后端测试
echo 6. 仅运行前端测试
echo 7. 退出
echo.
set /p choice="请选择 (1-7): "

if "%choice%"=="1" goto run_tests
if "%choice%"=="2" goto start_local
if "%choice%"=="3" goto start_docker
if "%choice%"=="4" goto run_and_start
if "%choice%"=="5" goto backend_test
if "%choice%"=="6" goto frontend_test
if "%choice%"=="7" goto exit
echo %RED%[错误]%NC% 无效选择
pause
goto exit

:run_tests
echo.
echo ==========================================
echo   运行测试
echo ==========================================
echo.

:: 后端测试
echo %GREEN%[测试]%NC% 运行后端测试...
cd backend
call npm install --silent
if errorlevel 1 (
    echo %RED%[错误]%NC% 后端依赖安装失败
    pause
    exit /b 1
)
call npm test
if errorlevel 1 (
    echo %RED%[错误]%NC% 后端测试失败
    pause
    exit /b 1
)
echo %GREEN%[成功]%NC% 后端测试通过
cd ..

:: 前端测试
echo.
echo %GREEN%[测试]%NC% 运行前端测试...
cd frontend
call npm install --silent
if errorlevel 1 (
    echo %RED%[错误]%NC% 前端依赖安装失败
    pause
    exit /b 1
)
call npx vitest run
if errorlevel 1 (
    echo %RED%[错误]%NC% 前端测试失败
    pause
    exit /b 1
)
echo %GREEN%[成功]%NC% 前端测试通过
cd ..

echo.
echo %GREEN%[完成]%NC% 所有测试通过！
pause
goto exit

:start_local
echo.
echo ==========================================
echo   启动开发服务器（本地模式）
echo ==========================================
echo.

:: 检查环境变量
if not exist ".env" (
    echo %YELLOW%[警告]%NC% 未找到.env文件，正在从示例创建...
    copy .env.example .env >nul
    echo %GREEN%[成功]%NC% 已创建.env文件，请根据需要修改配置
)

:: 启动后端
echo %GREEN%[启动]%NC% 启动后端服务器...
cd backend
start "TPshop Backend" cmd /k "npm run dev"
cd ..

:: 等待后端启动
echo %GREEN%[等待]%NC% 等待后端服务器启动...
timeout /t 5 /nobreak >nul

:: 启动前端
echo %GREEN%[启动]%NC% 启动前端服务器...
cd frontend
start "TPshop Frontend" cmd /k "npm run dev"
cd ..

echo.
echo %GREEN%[完成]%NC% 开发服务器已启动！
echo.
echo 访问地址：
echo   - 前端: http://localhost:3000
echo   - 后端API: http://localhost:4000
echo   - 健康检查: http://localhost:4000/health
echo.
echo 按任意键退出此脚本（服务器将继续运行）
pause >nul
goto exit

:start_docker
if "%USE_DOCKER%"=="false" (
    echo %RED%[错误]%NC% 未安装Docker，无法使用Docker模式
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   启动开发服务器（Docker模式）
echo ==========================================
echo.

:: 检查环境变量
if not exist ".env" (
    echo %YELLOW%[警告]%NC% 未找到.env文件，正在从示例创建...
    copy .env.example .env >nul
    echo %GREEN%[成功]%NC% 已创建.env文件，请根据需要修改配置
)

:: 启动Docker容器
echo %GREEN%[启动]%NC% 启动Docker容器...
docker-compose up -d
if errorlevel 1 (
    echo %RED%[错误]%NC% Docker启动失败
    pause
    exit /b 1
)

echo.
echo %GREEN%[完成]%NC% Docker容器已启动！
echo.
echo 访问地址：
echo   - 前端: http://localhost
echo   - 后端API: http://localhost:4000
echo   - MySQL: localhost:3306
echo   - Redis: localhost:6379
echo.
echo 查看日志: docker-compose logs -f
echo 停止服务: docker-compose down
echo.
pause
goto exit

:run_and_start
echo.
echo ==========================================
echo   运行测试并启动开发服务器
echo ==========================================
echo.

:: 运行测试
call :run_tests_silent
if errorlevel 1 (
    echo %RED%[错误]%NC% 测试失败，无法启动服务器
    pause
    exit /b 1
)

:: 启动服务器
goto start_local

:backend_test
echo.
echo %GREEN%[测试]%NC% 运行后端测试...
cd backend
call npm install --silent
call npm test
cd ..
pause
goto exit

:frontend_test
echo.
echo %GREEN%[测试]%NC% 运行前端测试...
cd frontend
call npm install --silent
call npx vitest run
cd ..
pause
goto exit

:run_tests_silent
cd backend
call npm install --silent
call npm test
if errorlevel 1 exit /b 1
cd ..
cd frontend
call npm install --silent
call npx vitest run
if errorlevel 1 exit /b 1
cd ..
exit /b 0

:exit
endlocal
