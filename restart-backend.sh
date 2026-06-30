# restart script for panifica backend
cd /home/team/shared/panifica/server
pkill -f "node index.js" 2>/dev/null
sleep 1
PORT=3000 node index.js &
sleep 2
curl -s http://localhost:3000/health
echo ""
echo "Server restarted with new fileParser"