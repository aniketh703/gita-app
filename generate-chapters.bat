@echo off
REM Batch file to run the Bhagavad Gita Chapter Generator on Windows
REM Usage: generate-chapters.bat [api|csv|json] [input_file]

setlocal enabledelayedexpansion

cd /d "%~dp0"

set SOURCE=api
set INPUT=

if not "%1"=="" set SOURCE=%1
if not "%2"=="" set INPUT=--input %2

echo.
echo ==============================================
echo  Bhagavad Gita Chapter Generator
echo ==============================================
echo.
echo Source: %SOURCE%
if not "!INPUT!"=="" echo Input:  !INPUT!
echo.

node generate-gita-chapters.js --source %SOURCE% %INPUT%

if %errorlevel% neq 0 (
    echo.
    echo ❌ Generator failed with exit code %errorlevel%
    pause
    exit /b %errorlevel%
)

echo.
echo ✅ Chapters generated successfully!
echo Chapter files are in: gita-app\data\chapters\
echo.
pause
