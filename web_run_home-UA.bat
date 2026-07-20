@echo off
setlocal
title LEE DBP - Local Web

set "ROOT_DIR=%~dp0"
set "HOST=127.0.0.1"
set "PORT=8081"
set "LOCAL_URL=http://localhost:%PORT%/"

cd /d "%ROOT_DIR%"

where node.exe >nul 2>&1
if errorlevel 1 (
  echo.
  echo [HATA] Node.js bulunamadi.
  echo LEE DBP'yi calistirmak icin Node.js 22.13 veya daha yeni bir surum kurun.
  echo.
  pause
  exit /b 1
)

if not exist "%ROOT_DIR%node_modules" (
  echo LEE DBP bagimliliklari ilk kez kuruluyor...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [HATA] Bagimliliklar kurulamadi.
    pause
    exit /b 1
  )
)

echo.
echo LEE Ders Bilgi Paketi baslatiliyor...
echo Adres: %LOCAL_URL%
echo Kapatmak icin bu pencerede Ctrl+C tuslarina basin.
echo.

start "" cmd /c "timeout /t 4 /nobreak >nul && start "" "%LOCAL_URL%""
call npm.cmd exec vite -- --config vite.local.config.ts

echo.
echo LEE DBP durduruldu.
pause
endlocal
