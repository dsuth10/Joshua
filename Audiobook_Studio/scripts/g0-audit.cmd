@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0g0-audit.ps1"
exit /b %ERRORLEVEL%
