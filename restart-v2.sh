#!/bin/bash
set -e
cd /home/team/shared/panifica/server
# Matar procesos viejos
sudo pkill -9 -f "node index.js" 2>/dev/null || true
sleep 2
# Iniciar nuevo servidor
PORT=3000 node index.js &
# Esperar y verificar
sleep 3
curl -s http://localhost:3000/health
echo ""
echo "✅ Servidor reiniciado con nuevo fileParser.js"