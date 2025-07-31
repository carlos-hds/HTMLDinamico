@echo off
SETLOCAL

echo ========== ALTERANDO BASE PARA LOCAL (/)
powershell -Command "(Get-Content vite.config.ts) -replace 'base: \"/HTMLDinamico-Public/\"', 'base: \"/\"' | Set-Content vite.config.ts"

echo.
echo ========== RODANDO BUILD LOCAL ==========
npm run build

echo.
echo ========== SERVINDO SITE LOCAL ==========
npx serve dist

echo.
echo ========== VOLTANDO BASE PARA GITHUB PAGES (/HTMLDinamico-Public/) ==========
powershell -Command "(Get-Content vite.config.ts) -replace 'base: \"/\"', 'base: \"/HTMLDinamico-Public/\"' | Set-Content vite.config.ts"

echo.
echo ✅ Processo finalizado. Base restaurada para publicação.
pause
