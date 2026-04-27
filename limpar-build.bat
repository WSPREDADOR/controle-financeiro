@echo off
echo === Limpeza de arquivos de build ===
echo.

echo Removendo dist\...
rd /s /q "dist" 2>nul && echo   OK: dist removido || echo   AVISO: dist nao pode ser removido (feche o app)

echo Removendo release\win-unpacked\...
rd /s /q "release\win-unpacked" 2>nul && echo   OK: release\win-unpacked removido || echo   AVISO: win-unpacked nao pode ser removido

echo Removendo release-splash\...
rd /s /q "release-splash" 2>nul && echo   OK: release-splash removido || echo   AVISO: release-splash nao pode ser removido

echo.
echo Limpeza concluida!
echo Se ainda aparecerem avisos, feche o aplicativo Controle de Dívidas e rode novamente.
pause
