@echo off
SETLOCAL

echo ========== ALTERANDO BASE PARA LOCAL (/)
powershell -Command "(Get-Content vite.config.ts) -replace 'base: \"/HTMLDinamico/\"', 'base: \"/\"' | Set-Content vite.config.ts"

echo.
echo ========== RODANDO BUILD LOCAL ==========
npm run build

echo.
echo ========== SERVINDO SITE LOCAL ==========
npx serve docs

echo.
echo ========== VOLTANDO BASE PARA GITHUB PAGES (/HTMLDinamico/) ==========
powershell -Command "(Get-Content vite.config.ts) -replace 'base: \"/\"', 'base: \"/HTMLDinamico/\"' | Set-Content vite.config.ts"

echo.
echo ✅ Processo finalizado. Base restaurada para publicação.
pause
