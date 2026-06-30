const https = require('https');
https.get('https://docs.cto.new/llms.txt', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Save to file
    require('fs').writeFileSync('/tmp/cto-docs.txt', d);
    console.log('DOCS LOADED:', d.substring(0, 2000));
  });
}).on('error', e => console.log('ERROR:', e.message));