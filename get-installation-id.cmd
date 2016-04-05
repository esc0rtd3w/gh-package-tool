@echo off

:: Part of the GameHouse Package Tool (Javascript)

:: Parent Project: RealArcade Wrapper Killer
:: esc0rtd3w / cRypTiC


:: This script will retrieve the installation ID from an Acid 1.20.128.0 GameHouse Stub
:: The Installation ID can be extracted from any stub at hex offset 0x949CE - 0x949DD (16 Bytes)

:: Requirements: sfk.exe (included with RealArcade Wrapper Killer)

:: TODO: Get Game Names from Auto stub download and create a list of all Installation IDs to Text file

set iid=0
set inputStub=%1
set outputText="%temp%\ura-install-id-temp.txt"

set readID="%~dp0bin\sfk.exe" hexdump -quiet -pure -offlen 0x949CE 16

set gameName=0


:readIID
%readID% "%inputStub%">%outputText%

for /f "tokens=1*delims=:" %%a in ('findstr /n "^" %outputText%') do if %%a equ 2 echo %%b>%outputText%

set /p iid=<%outputText%

goto stubName


:stubName

for %%a in ("%inputStub%") do (
    set gameName=%%~nxa
)

goto outText


:outText

setlocal enableextensions enabledelayedexpansion
set gameName=!gameName:~10,-4!
echo >!gameName!-%iid%.txt
endlocal

goto end


:readMulti



goto end


:end

