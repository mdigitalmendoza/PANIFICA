const { execSync } = require('child_process');
const path = require('path');

// Kill old node processes
try {
  execSync('pkill -f "node index.js" 2>/dev/null', { stdio: 'pipe' });
  console.log('Killed old processes');
} catch(e) { /* ok */ }

// Wait for port to be free
require('http').get('http://localhost:3000/health', () => {
  // Port still in use, try harder
  execSync('fuser -k 3000/tcp 2>/dev/null || true');
}).on('error', () => {
  // Port is free, good
});

setTimeout(() => {
  // Start new server
  const cp = require('child_process');
  const child = cp.spawn('node', ['start-v2.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '3000' },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true
  });
  child.stdout.on('data', d => console.log(d.toString()));
  child.stderr.on('data', d => console.error(d.toString()));
  child.unref();
  
  console.log('Server start-v2.js launched on port 3000');
}, 2000);