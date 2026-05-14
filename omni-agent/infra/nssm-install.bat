@echo off
REM Run this as Administrator to install OmniAgent backend as a Windows service.
REM Requires: nssm.exe in PATH, Python venv at C:\omni-agent\backend\venv

set SERVICE_NAME=OmniAgentBackend
set BACKEND_DIR=C:\omni-agent\backend
set PYTHON=%BACKEND_DIR%\venv\Scripts\python.exe
set SCRIPT=%BACKEND_DIR%\main.py

nssm install %SERVICE_NAME% %PYTHON% -m uvicorn main:app --host 0.0.0.0 --port 8000
nssm set %SERVICE_NAME% AppDirectory %BACKEND_DIR%
nssm set %SERVICE_NAME% AppStdout %BACKEND_DIR%\logs\stdout.log
nssm set %SERVICE_NAME% AppStderr %BACKEND_DIR%\logs\stderr.log
nssm set %SERVICE_NAME% Start SERVICE_AUTO_START
nssm start %SERVICE_NAME%

echo Done. OmniAgent backend is running as a Windows service.
