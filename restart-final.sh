#!/bin/bash
set -e
echo "=== Matando servidor anterior ==="
sudo pkill -9 -f "node index.js" 2>/dev/null || true
sleep 2
echo "=== Iniciando nuevo servidor en puerto 3000 ==="
cd /home/team/shared/panifica/server
PORT=3000 nohup node index.js > /tmp/panifica-new.log 2>&1 &
sleep 3
echo "=== Verificando ==="
curl -s http://localhost:3000/health
echo ""
echo "=== Listo ==="