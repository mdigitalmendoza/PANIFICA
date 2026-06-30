// Check network info
const os = require('os');
const nets = os.networkInterfaces();
const results = {};
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      console.log(`${name}: ${net.address}`);
    }
  }
}
console.log('hostname:', os.hostname());

// Make a simple request to see if server responds
const http = require('http');
http.get('http://localhost:3000/health', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('Health:', d));
}).on('error', e => console.log('Health error:', e.message));