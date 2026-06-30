#!/bin/bash
cd /home/team/shared/panifica/server
# Kill existing node process
kill $(ps aux | grep 'node index.js' | grep -v grep | awk '{print $2}') 2>/dev/null
sleep 2
# Remove the .env PORT=3000 to use default 3001, so it doesn't conflict
# Actually just start on port 3000
nohup node index.js > /tmp/panifica-server.log 2>&1 &
sleep 2
curl -s http://localhost:3000/health
echo ""
echo "Done"