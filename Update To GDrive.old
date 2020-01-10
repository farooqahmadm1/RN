@echo off
REM Two XCOPY commands because one command just shows the files to be copied while other, with /Q /D /E /Y, actually copies the files
SET name=RN App Boilerplate
SET source="%cd%"
SET gdrivepath="C:\Users\Praveen\Google Drive\GDocuments\Dev\My Plugins\RN App Boilerplate"
SET readme="SYNC.txt"
TITLE Google Drive Project Updater
ECHO Google Drive Project Updater V1.6.0
ECHO Created By Praveen K.J.
ECHO Updates project files to Google Drive
ECHO Configured for %name%
ECHO Press any key to update!
Pause >nul

ECHO //////////////////START////////////// >> %readme%
REG Query "HKEY_CURRENT_USER\Control Panel\International" /v sShortDate >> %readme%
ECHO.Last Update Check on %date% at %time% by user %USERNAME% of %USERDOMAIN% >> %readme%
ECHO \\\\\\\\\\\\\\\\\\END\\\\\\\\\\\\\\\\ >> %readme%

CLS
ECHO Files that will be copied:
XCOPY %source% %gdrivepath% /L /D /E /Y /EXCLUDE:EXCLUDE.txt
ECHO Press Any Key To Start Copying...
PAUSE >nul
XCOPY %source% %gdrivepath% /Q /D /E /Y /EXCLUDE:EXCLUDE.txt

ECHO Press any key to Exit
pause >nul