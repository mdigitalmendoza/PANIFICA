const http = require('http');
const fs = require('fs');

function upload() {
  return new Promise((resolve, reject) => {
    const boundary = '----Test' + Date.now();
    const buffer = fs.readFileSync('/home/team/shared/panifica/samples/pedidos_ejemplo.xlsx');
    
    let body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="recetas"; filename="pedidos_ejemplo.xlsx"\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`),
      buffer,
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="pedidos"; filename="pedidos_ejemplo.xlsx"\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const req = http.request({
      hostname: 'localhost', port: 3000, path: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function calculate() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost', port: 3000, path: '/api/calculate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('=== TEST PANIFICA ===');
    
    const up = await upload();
    console.log('UPLOAD:', JSON.stringify(up, null, 2));
    
    if (up.status === 200) {
      const calc = await calculate();
      console.log('CALCULATE:', JSON.stringify(calc, null, 2));
    }
  } catch(e) {
    console.log('ERROR:', e.message);
  }
  fs.writeFileSync('/tmp/panifica-test-final.txt', 'DONE');
}

main();