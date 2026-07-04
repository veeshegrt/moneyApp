#!/bin/bash
# Unset ELECTRON_RUN_AS_NODE to ensure Electron runs in proper mode
unset ELECTRON_RUN_AS_NODE
export VITE_DEV_SERVER_URL=http://localhost:5180
exec ./node_modules/electron/dist/electron.exe dist-electron/main.js
