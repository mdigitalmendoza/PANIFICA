const { execSync } = require('child_process');
console.log('Rebuilding frontend...');
execSync('cd /home/team/shared/panifica/client && npx vite build 2>&1', {
  stdio: 'pipe',
  cwd: '/home/team/shared/panifica/client'
});
console.log('Build complete!');