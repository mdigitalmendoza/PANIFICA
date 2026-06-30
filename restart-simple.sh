#!/bin/bash
# Kill ONLY the production server (index.js or start-v2.js)
kill $(ps aux | grep -E 'node.*(index\.js|start-v2\.js)' | grep -v grep | awk '{print $2}') 2>/dev/null
sleep 2
cd /home/team/shared/panifica/server
PORT=3000 node start-v2.js &