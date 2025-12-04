@echo off
REM Build script for XDynamic Extension Production (Windows)
REM This script builds the extension ready for distribution

echo.
echo ========================================
echo Building XDynamic Extension
echo ========================================
echo.

REM Step 1: Check if .env.production exists
echo [1/5] Checking environment configuration...
if not exist ".env.production" (
    echo [WARNING] .env.production not found!
    echo Creating .env.production from template...
    (
        echo VITE_API_BASE_URL=https://app.xdynamic.cloud
        echo VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
        echo VITE_ENV=production
        echo VITE_ADMIN_DASHBOARD_URL=https://admin.xdynamic.cloud
    ) > .env.production
    echo.
    echo [WARNING] Please update .env.production with your production settings
    echo After updating, run this script again.
    pause
    exit /b 1
)
echo [OK] .env.production found
echo.

REM Step 2: Check Node modules
echo [2/5] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo [OK] Dependencies already installed
)
echo.

REM Step 3: Clean previous build
echo [3/5] Cleaning previous build...
if exist "dist" (
    rmdir /s /q dist
    echo [OK] Cleaned dist directory
)
if exist "xdynamic-extension.zip" (
    del /q xdynamic-extension.zip
    echo [OK] Removed old ZIP file
)
echo.

REM Step 4: Build extension
echo [4/5] Building extension...
call npm run build:production

if not exist "dist" (
    echo [ERROR] Build failed! dist directory not created
    pause
    exit /b 1
)
echo [OK] Build completed successfully
echo.

REM Step 5: Create ZIP file
echo [5/5] Creating distribution package...
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'xdynamic-extension.zip' -Force"
echo [OK] ZIP file created
echo.

echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Distribution files:
echo   - dist\                    (Unpacked extension)
echo   - xdynamic-extension.zip   (Ready for distribution)
echo.
echo Next steps:
echo   1. Test locally: Load 'dist' folder in Chrome
echo   2. Distribute: Send 'xdynamic-extension.zip' to users
echo   3. Or publish to Chrome Web Store
echo.
echo Backend API configured:
type .env.production | findstr VITE_API_BASE_URL
echo.
pause
