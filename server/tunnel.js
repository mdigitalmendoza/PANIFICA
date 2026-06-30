// Installs ngrok and creates a tunnel to port 3001 (frontend)
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

async function main() {
  // 1. Check if ngrok is available
  try {
    execSync('which ngrok', { stdio: 'pipe' });
    console.log('ngrok already installed');
  } catch(e) {
    console.log('Installing ngrok via npm...');
    execSync('npm install -g ngrok 2>/dev/null', { stdio: 'pipe', cwd: __dirname });
  }
  
  // 2. Start ngrok tunnel on port 3001
  console.log('Starting ngrok tunnel to port 3001...');
  const ngrok = spawn('ngrok', ['http', '3001', '--log=stdout'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  });
  
  ngrok.stdout.on('data', (d) => {
    const line = d.toString();
    process.stdout.write(line);
    // Look for the public URL
    if (line.includes('url=')) {
      const match = line.match(/url=(https?:\/\/[^\s]+)/);
      if (match) {
        fs.writeFileSync('/tmp/ngrok-url.txt', match[1]);
        console.log('PUBLIC URL FOUND:', match[1]);
      }
    }
  });
  
  ngrok.stderr.on('data', (d) => process.stderr.write(d.toString()));
  ngrok.unref();
  
  // Wait and check
  await new Promise(r => setTimeout(r, 5000));
  
  // Also try ngrok API
  try {
    const resp = await new Promise((resolve, reject) => {
      http.get('http://localhost:4040/api/tunnels', (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(d));
      }).on('error', reject);
    });
    fs.writeFileSync('/tmp/ngrok-api.json', resp);
    console.log('ngrok API response:', resp.substring(0, 500));
  } catch(e) {
    console.log('ngrok API not ready yet:', e.message);
  }
  
  console.log('Done. Check /tmp/ngrok-url.txt for the URL');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});