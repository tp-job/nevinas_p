@echo off
echo ========================================
echo Syncing Images to MongoDB
echo ========================================
echo.

cd server
node src/syncGallery.js

echo.
echo ========================================
echo Sync Complete!
echo ========================================
echo.
pause

