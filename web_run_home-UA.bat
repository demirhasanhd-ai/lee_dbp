@echo off
setlocal
title LEE DBP - Local Web

set "ROOT_DIR=%~dp0"
set "RUN_ROOT=C:\lee_dbp"
if not exist "%RUN_ROOT%\package.json" (
  mklink /J "%RUN_ROOT%" "%ROOT_DIR%" >nul 2>&1
)
if exist "%RUN_ROOT%\package.json" (
  set "APP_DIR=%RUN_ROOT%"
) else (
  set "APP_DIR=%ROOT_DIR%"
)
set "HOST=127.0.0.1"
set "PORT=8081"
set "LOCAL_URL=http://localhost:%PORT%/dbp/"
set "LOCAL_VOLUME_DIR=%APP_DIR%\local-volume"
set "LOCAL_DATA_DIR=%LOCAL_VOLUME_DIR%\data"
set "LOCAL_BACKUP_DIR=%LOCAL_DATA_DIR%\backups"
set "DBP_DATA_DIR=%LOCAL_DATA_DIR%"
set "DBP_SQLITE_PATH=%LOCAL_DATA_DIR%\dbp.sqlite"
set "DBP_BACKUP_DIR=%LOCAL_BACKUP_DIR%"
set "NODE_ENV=production"
set "NEXT_PUBLIC_E_ENSTITU_URL=http://localhost:8080"
set "DBP_OPEN_BROWSER=1"

cd /d "%APP_DIR%"

where node.exe >nul 2>&1
if errorlevel 1 (
  echo.
  echo [HATA] Node.js bulunamadi.
  echo LEE DBP'yi calistirmak icin Node.js 22.13 veya daha yeni bir surum kurun.
  echo.
  pause
  exit /b 1
)

if not exist "%APP_DIR%\node_modules" (
  echo LEE DBP bagimliliklari ilk kez kuruluyor...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [HATA] Bagimliliklar kurulamadi.
    pause
    exit /b 1
  )
)

node.exe --preserve-symlinks --preserve-symlinks-main "%APP_DIR%\scripts\check-local-dbp-port.mjs" >nul 2>&1
if errorlevel 2 (
  echo.
  echo [HATA] %PORT% portu acik ama canli DBP server yanit vermiyor.
  echo Bu portu kullanan diger yerel uygulamayi kapatip tekrar deneyin.
  echo.
  pause
  exit /b 1
)
if not errorlevel 1 (
  echo.
  echo LEE Ders Bilgi Paketi zaten calisiyor.
  echo Adres: %LOCAL_URL%
  echo Mevcut sekme/pencere aciliyor...
  echo.
  start "" "%LOCAL_URL%"
  pause
  exit /b 0
)

if not exist "%LOCAL_DATA_DIR%" mkdir "%LOCAL_DATA_DIR%"
if not exist "%LOCAL_BACKUP_DIR%" mkdir "%LOCAL_BACKUP_DIR%"

echo.
echo LEE Ders Bilgi Paketi canli server taktigiyle baslatiliyor...
echo Adres: %LOCAL_URL%
echo Yerel veri klasoru: %LOCAL_VOLUME_DIR%
echo SQLite: %DBP_SQLITE_PATH%
echo Build bittikten sonra server bu pencerede acik kalir; bu normaldir.
echo Kapatmak icin bu pencerede Ctrl+C tuslarina basin.
echo.

echo Yerel DBP server aciliyor...
node.exe --preserve-symlinks --preserve-symlinks-main "%APP_DIR%\scripts\start-local-dbp.mjs"

echo.
echo LEE DBP durduruldu.
pause
endlocal
