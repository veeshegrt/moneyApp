@echo off
set ELECTRON_RUN_AS_NODE=
set VITE_DEV_SERVER_URL=http://localhost:5180
.\node_modules\electron\dist\electron.exe dist-electron\main.js
