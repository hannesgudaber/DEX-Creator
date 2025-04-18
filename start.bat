@echo off
echo ===================================================
echo Uniswap V2 Deployment auf Custom Blockchain
echo ===================================================
echo.

echo Überprüfe, ob wallet.txt existiert...
if not exist "wallet.txt" (
    echo FEHLER: Die Datei wallet.txt wurde nicht gefunden!
    echo Bitte erstellen Sie eine wallet.txt-Datei mit Ihrer Ethereum-Adresse und Ihrem privaten Schlüssel.
    echo Format: 
    echo [Adresse]
    echo [Privater Schlüssel]
    pause
    exit /b 1
)

echo Wallet.txt gefunden, starte Deployment...
echo.
echo Führe Uniswap V2 Deployment aus...
node direct-deploy.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ===================================================
    echo FEHLER: Deployment fehlgeschlagen!
    echo Bitte überprüfen Sie die Fehlermeldungen oben.
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo Deployment erfolgreich abgeschlossen!
    echo Die Vertragsinformationen wurden in direct-deployments.json gespeichert.
    echo ===================================================
    echo.
    echo Sie können diese Vertragsadressen nun für Ihre DApp oder weitere Interaktionen verwenden.
)

echo.
pause
