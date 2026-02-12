@echo off
echo Installing bcryptjs...
npm install bcryptjs
npm install -D @types/bcryptjs
if %errorlevel% neq 0 (
    echo Error installing dependencies.
    pause
    exit /b %errorlevel%
)
echo Dependencies installed successfully!
pause
