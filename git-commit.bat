@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo   TPshop 重构项目 - 一键提交脚本
echo ==========================================
echo.

:: 检查是否在Git仓库中
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [ERROR] 当前目录不是Git仓库
    pause
    exit /b 1
)

:: 检查是否有未提交的更改
git diff-index --quiet HEAD -- 2>nul
if not errorlevel 1 (
    echo [WARN] 没有检测到更改
    pause
    exit /b 0
)

:: 获取提交信息
if "%~1"=="" (
    :: 自动生成提交信息
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
    set timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%
    
    :: 分析更改类型
    git diff --stat | findstr /i "feat feature" >nul
    if not errorlevel 1 (
        set commit_msg=feat: 更新功能 - !timestamp!
    ) else (
        git diff --stat | findstr /i "fix bug" >nul
        if not errorlevel 1 (
            set commit_msg=fix: 修复问题 - !timestamp!
        ) else (
            git diff --stat | findstr /i "docs doc" >nul
            if not errorlevel 1 (
                set commit_msg=docs: 更新文档 - !timestamp!
            ) else (
                set commit_msg=chore: 代码更新 - !timestamp!
            )
        )
    )
) else (
    set commit_msg=%~1
)

echo [INFO] 添加所有更改...
git add -A

echo [INFO] 提交更改: !commit_msg!
git commit -m "!commit_msg!"

if errorlevel 1 (
    echo [ERROR] 提交失败
    pause
    exit /b 1
)

echo [INFO] 提交成功 ✓

:: 获取当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i

echo [INFO] 推送到远程仓库 (分支: !current_branch!)...
git push origin "!current_branch!"

if errorlevel 1 (
    echo [ERROR] 推送失败
    pause
    exit /b 1
)

echo [INFO] 推送成功 ✓

:: 显示统计
echo.
echo [INFO] === 提交统计 ===
echo 分支: !current_branch!
for /f "tokens=*" %%i in ('git log -1 --pretty=format:"%%h %%s"') do echo 最新提交: %%i
for /f "tokens=*" %%i in ('git rev-list --count HEAD') do echo 提交数量: %%i
echo.

echo [INFO] 所有操作完成！
pause
