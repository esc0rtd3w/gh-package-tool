@echo off

:: Part of the GameHouse Package Tool (Javascript)

:: Parent Project: RealArcade Wrapper Killer
:: esc0rtd3w / cRypTiC


:: This script will retrieve the installation ID from an Acid 1.20.128.0 GameHouse Stub
:: The Installation ID can be extracted from any stub at hex offset 0x949CE - 0x949DD (16 Bytes)

:: Requirements: sfk.exe (included with RealArcade Wrapper Killer)

set inputStub=%1

set readID="%cd%\bin\sfk.exe" hexdump -pure -offlen 0x949CE 16


cls
echo %inputStub%
echo.
echo.
pause>nul

%readID% "%inputStub%"


:end

