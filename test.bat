@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo   TPshop 重构项目 - 测试运行脚本
echo ==========================================
echo.

:: 颜色定义
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"

:: 记录开始时间
set "startTime=%time%"

:: 运行后端测试
echo %GREEN%[1/2]%NC% 运行后端测试...
echo ------------------------------------------
cd backend
call npm install --silent 2>nul
if errorlevel 1 (
    echo %RED%[错误]%NC% 后端依赖安装失败
    cd ..
    pause
    exit /b 1
)
call npm test
set "backendResult=%errorlevel%"
cd ..
echo.

if %backendResult% neq 0 (
    echo %RED%[失败]%NC% 后端测试失败
    set "allPassed=false"
) else (
    echo %GREEN%[成功]%NC% 后端测试通过
)

:: 运行前端测试
echo %GREEN%[2/2]%NC% 运行前端测试...
echo ------------------------------------------
cd frontend
call npm install --silent 2>nul
if errorlevel 1 (
    echo %RED%[错误]%NC% 前端依赖安装失败
    cd ..
    pause
    exit /b 1
)
call npx vitest run
set "frontendResult=%errorlevel%"
cd ..
echo.

if %frontendResult% neq 0 (
    echo %RED%[失败]%NC% 前端测试失败
    set "allPassed=false"
) else (
    echo %GREEN%[成功]%NC% 前端测试通过
)

:: 计算耗时
set "endTime=%time%"

:: 显示结果
echo ==========================================
echo   测试结果汇总
echo ==========================================
echo.

if %backendResult% equ 0 (
    echo 后端测试: %GREEN%通过%NC%
) else (
    echo 后端测试: %RED%失败%NC%
)

if %frontendResult% equ 0 (
    echo 前端测试: %GREEN%通过%NC%
) else (
    echo 前端测试: %RED%失败%NC%
)

echo.
echo 开始时间: %startTime%
echo 结束时间: %endTime%

if %backendResult% equ 0 if %frontendResult% equ 0 (
    echo.
    echo %GREEN%===========================================%NC%
    echo %GREEN%   所有测试通过！%NC%
    echo %GREEN%===========================================%NC%
) else (
    echo.
    echo %RED%===========================================%NC%
    echo %RED%   部分测试失败%NC%
    echo %RED%===========================================%NC%
)

echo.
pause
endlocal
