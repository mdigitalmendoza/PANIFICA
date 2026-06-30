const { execSync } = require('child_process');
const path = '/home/team/shared/panifica';
const results = [];

function run(cmd) {
  try {
    const out = execSync(cmd, { cwd: path, stdio: 'pipe', encoding: 'utf8', timeout: 30000 });
    results.push(`✅ ${cmd.substring(0,60)}: ${out.trim().substring(0,200)}`);
  } catch(e) {
    results.push(`❌ ${cmd.substring(0,60)}: ${e.message.substring(0,200)}`);
  }
}

run('which git');
run('git --version');

// Check if .git exists
const fs = require('fs');
if (fs.existsSync(path + '/.git')) {
  results.push('✅ .git exists (already a repo)');
} else {
  results.push('ℹ️ No .git yet, initializing...');
  run('git init');
}

// Add files
run('git add -A');
run('git status --short');

console.log(results.join('\n'));
console.log('\nDONE');