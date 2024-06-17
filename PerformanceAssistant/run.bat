@echo off
setlocal

:: Get the directory of the batch file
set "SCRIPT_DIR=%~dp0"
echo Script directory: %SCRIPT_DIR%

:: Run npm install in server directory in a new command prompt window
start "" /wait cmd /c "cd /d "%SCRIPT_DIR%\server" && echo Running npm install in server directory... && npm i && echo Backend packages installed successfully. && exit"
if errorlevel 1 (
    echo Failed to install backend packages.
    exit /b 1
)

:: Run npm install vite in client\src directory in a new command prompt window
start "" /wait cmd /c "cd /d "%SCRIPT_DIR%\client\src" && echo Running npm install vite in client\src directory... && npm install vite && echo Frontend packages installed successfully. && exit"
if errorlevel 1 (
    echo Failed to install frontend packages.
    exit /b 1
)

:: Run start_servers.bat
echo Running start_servers.bat...
start "" /wait cmd /c "cd /d "%SCRIPT_DIR%" && start_servers.bat"
if errorlevel 1 (
    echo Failed to start servers.
    exit /b 1
)

:: If everything was successful, delete the batch file
echo Deleting the batch file...
del "%~f0"

echo Batch file deleted successfully.
endlocal
