@echo off
echo ========== BUILDANDO O PROJETO ==========
npm run build

echo.
echo ========== INDO PARA A PASTA DOCS ==========
cd docs

echo.
echo ========== INICIALIZANDO GIT ==========
git init
git branch -M main
git remote add origin https://github.com/carlos-hds/HTMLDinamico-Public.git

echo.
echo ========== COMMITANDO ==========
git add .
git commit -m "Deploy automático"

echo.
echo ========== ENVIANDO PARA O GITHUB PAGES ==========
git push -f origin main

echo.
echo ✅ Deploy finalizado com sucesso!
pause
