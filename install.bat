@echo off
REM Install all required Node.js packages for DEX Deployer

ECHO =============================================
ECHO   Installing DEX Deployer dependencies...
ECHO =============================================

REM Install in main directory
npm install

REM Install in pool-helper (if package.json exists)
IF EXIST pool-helper\package.json (
    cd pool-helper
    npm install
    cd ..
)

ECHO.
ECHO Installation complete!
PAUSE
