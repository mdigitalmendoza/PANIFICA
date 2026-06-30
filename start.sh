#!/bin/bash
kill $(ps aux | grep 'node' | grep -v grep | awk '{print $2}') 2>/dev/null
sleep 2
cd /home/team/shared/panifica/server
PORT=3000 node start-v2.js &
sleep 3
curl -s http://localhost:3000/health