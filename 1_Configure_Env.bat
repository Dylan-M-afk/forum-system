@echo off
setlocal enabledelayedexpansion

REM Navigate to the server folder
cd server

REM Check if .env.sample exists, then rename to .env
if exist .env.sample (
    rename .env.sample .env
    echo .env.sample found and renamed to .env
) else (
    echo .env.sample not found
)

REM Check if .env exists
if exist .env (
    echo .env found
    REM Prompt the user for MongoDB configuration values
    set /p MONGODB_URI=Enter MongoDB URI:
    set /p DATABASE_NAME=Enter Database Name:
    set /p PEPPER=Enter Pepper Value:

    REM Write configuration values to .env file
    (
      echo MONGODB_URI="!MONGODB_URI!"
      echo DATABASE_NAME="!DATABASE_NAME!"
      echo PEPPER="!PEPPER!"
    ) > .env

    echo Configuration completed successfully.
)

REM Return to the original folder
cd ..

REM Wait for any key before closing
pause
