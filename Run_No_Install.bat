@echo off

REM Navigate to the Server folder
cd server

REM Run npm start in the Server folder
start cmd /k npm start

REM Return to the original folder
cd ..

REM Navigate to the client folder
cd client

REM Run npm start in the client folder
start cmd /k npm start

REM Return to the original folder
cd ..