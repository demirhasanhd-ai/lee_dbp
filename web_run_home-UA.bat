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
set "NODE_ENV=development"
set "DBP_LOCAL_DEV=1"
set "NEXT_PUBLIC_E_ENSTITU_URL=http://localhost:8080"
set "DBP_OPEN_BROWSER=1"

cd /d "%APP_DIR%"

where node.exe >nul 2>&1
if errorlevel 1 (
  echo.
  echo [%date% %time:~0,8%] [HATA] Node.js bulunamadi.
  echo [%date% %time:~0,8%] LEE DBP'yi calistirmak icin Node.js 24 veya daha yeni bir surum kurun.
  echo.
  echo [%date% %time:~0,8%] Devam etmek icin bir tusa basin...
  pause >nul
  exit /b 1
)

set "NEED_NPM_INSTALL=0"
if not exist "%APP_DIR%\node_modules" set "NEED_NPM_INSTALL=1"
if not exist "%APP_DIR%\node_modules\.package-lock.json" set "NEED_NPM_INSTALL=1"
if not exist "%APP_DIR%\node_modules\@cloudflare\vite-plugin\package.json" set "NEED_NPM_INSTALL=1"
if exist "%APP_DIR%\package-lock.json" if exist "%APP_DIR%\node_modules\.package-lock.json" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$lock = Join-Path $env:APP_DIR 'package-lock.json'; $installed = Join-Path $env:APP_DIR 'node_modules\.package-lock.json'; if ((Get-Item -LiteralPath $lock).LastWriteTimeUtc -gt (Get-Item -LiteralPath $installed).LastWriteTimeUtc) { exit 10 }"
  if errorlevel 10 set "NEED_NPM_INSTALL=1"
)

if "%NEED_NPM_INSTALL%"=="1" (
  call :log "LEE DBP bagimliliklari kuruluyor/guncelleniyor..."
  node.exe "%APP_DIR%\scripts\with-timestamps.mjs" "%ComSpec%" /d /s /c "npm.cmd install --include=dev"
  if errorlevel 1 (
    echo.
    call :log "[HATA] Bagimliliklar kurulamadi."
    call :wait_for_key
    exit /b 1
  )
)

node.exe --preserve-symlinks --preserve-symlinks-main "%APP_DIR%\scripts\check-local-dbp-port.mjs" >nul 2>&1
if errorlevel 3 (
  echo.
  call :log "[BILGI] Eski uretim sunucusu halen %PORT% portunda calisiyor."
  call :log "Eski DBP sunucu penceresini Ctrl+C ile kapatin ve bu dosyayi yeniden acin."
  call :log "Yeni baslatici arayuz degisikliklerini tarayiciya otomatik yansitir."
  echo.
  call :wait_for_key
  exit /b 1
)
if errorlevel 2 (
  echo.
  call :log "[HATA] %PORT% portu acik ama canli DBP server yanit vermiyor."
  call :log "Bu portu kullanan diger yerel uygulamayi kapatip tekrar deneyin."
  echo.
  call :wait_for_key
  exit /b 1
)
if not errorlevel 1 (
  echo.
  call :log "LEE Ders Bilgi Paketi zaten calisiyor."
  call :log "Adres: %LOCAL_URL%"
  call :log "Mevcut sekme/pencere aciliyor..."
  echo.
  start "" "%LOCAL_URL%"
  call :wait_for_key
  exit /b 0
)

if not exist "%LOCAL_DATA_DIR%" mkdir "%LOCAL_DATA_DIR%"
if not exist "%LOCAL_BACKUP_DIR%" mkdir "%LOCAL_BACKUP_DIR%"

echo.
call :log "LEE Ders Bilgi Paketi gelistirme modunda baslatiliyor..."
call :log "Adres: %LOCAL_URL%"
call :log "Yerel veri klasoru: %LOCAL_VOLUME_DIR%"
call :log "SQLite: %DBP_SQLITE_PATH%"
call :log "Metin, React ve CSS degisiklikleri tarayiciya otomatik yansir."
call :log "API kodu degisikliklerinde sunucu otomatik yeniden baslar."
call :log "Kapatmak icin bu pencerede Ctrl+C tuslarina basin."
echo.

call :log "Yerel DBP server aciliyor..."
node.exe "%APP_DIR%\scripts\with-timestamps.mjs" node.exe --preserve-symlinks --preserve-symlinks-main --watch --watch-path=server.mjs --watch-path=lib --watch-path=scripts --watch-preserve-output "%APP_DIR%\scripts\start-local-dbp.mjs"

echo.
call :log "LEE DBP durduruldu."
call :wait_for_key
endlocal
exit /b

:log
node.exe "%APP_DIR%\scripts\with-timestamps.mjs" --message "%~1"
exit /b

:wait_for_key
call :log "Devam etmek icin bir tusa basin..."
pause >nul
exit /b
