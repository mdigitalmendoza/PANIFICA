const { execSync } = require('child_process');
const fs = require('fs');
const path = '/home/team/shared/panifica';
const log = [];

function run(cmd) {
  try {
    const out = execSync(cmd, { cwd: path, stdio: 'pipe', encoding: 'utf8', timeout: 30000 });
    log.push('OK: ' + out.trim().substring(0, 500));
  } catch(e) {
    log.push('ERR: ' + e.message.substring(0, 300));
  }
}

run('which git');
run('git --version');

if (!fs.existsSync(path + '/.git')) {
  run('git init');
  run('git config user.email "panifica@bakeries.app"');
  run('git config user.name "Panifica"');
}

// Create .gitignore
fs.writeFileSync(path + '/.gitignore', 'node_modules/\n.env\ndist/\n*.log\n');
run('git add -A');
run('git status --short');

// Try to get remote URL from env
if (process.env.GIT_REMOTE) {
  run('git remote add origin ' + process.env.GIT_REMOTE);
  run('git branch -M main');
  run('git commit -m "MVP Panifica"');
  // Try to push
  try {
    const pushResult = execSync('git push -u origin main', { cwd: path, stdio: 'pipe', encoding: 'utf8', timeout: 60000 });
    log.push('PUSH OK: ' + pushResult.trim().substring(0, 500));
  } catch(e) {
    log.push('PUSH ERR: ' + e.message.substring(0, 500));
  }
}

fs.writeFileSync('/tmp/git-result.txt', log.join('\n---\n'));
console.log('DONE - check /tmp/git-result.txt');