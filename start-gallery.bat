@echo off
echo ========================================
echo Starting Gallery Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
cd server
start cmd /k "npm start"
timeout /t 3 /nobreak >nul

cd ..
echo.
echo [2/2] Starting Frontend...
cd client
start cmd /k "npm run dev"

echo.
echo ========================================
echo Gallery Application Started!
echo ========================================
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173/gallery
echo.
echo Press any key to exit this window...
pause >nul

