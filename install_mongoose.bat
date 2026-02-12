@echo off
echo Installing mongoose...
npm install mongoose
if %errorlevel% neq 0 (
    echo Error installing mongoose. Please ensure Node.js and npm are installed and in your PATH.
    pause
    exit /b %errorlevel%
)
echo Mongoose installed successfully!
pause
