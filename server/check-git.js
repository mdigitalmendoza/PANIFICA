const { execSync } = require('child_process');
try {
  const out = execSync('which git && git --version', { encoding: 'utf8' });
  console.log('GIT:', out.trim());
} catch(e) {
  console.log('NO GIT:', e.message);
}