@echo off

:: Part of the GameHouse Package Tool (Javascript)

:: Parent Project: RealArcade Wrapper Killer
:: esc0rtd3w / cRypTiC


:: This script will retrieve the installation ID from an Acid 1.20.128.0 GameHouse Stub
:: The Installation ID can be extracted from any stub at hex offset 0x949CE - 0x949DD (16 Bytes)

:: Requirements: sfk.exe (included with RealArcade Wrapper Killer)

set inputStub=%1
set outputText="%cd%\output.txt"
set outputTextTemp="%cd%\output_temp.txt"

set readID="%cd%\bin\sfk.exe" hexdump -quiet -pure -offlen 0x949CE 16

::%readID% "%inputStub%">%outputText%
%readID% "%inputStub%"

::for /f "skip=1 delims=*" %%a in (%outputText%) do (
::echo %%a >%outputTextTemp%   
::)
::xcopy %outputTextTemp% %outputText% /y
::del %outputTextTemp% /f /q

pause>nul

:end

