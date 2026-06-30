const fs = require('fs');
const http = require('http');
const xlsx = require('xlsx');

// Read the xlsx file
const buffer = fs.readFileSync('/home/team/shared/panifica/samples/pedidos_ejemplo.xlsx');

// Build multipart form data manually
const boundary = '----PanificaTest' + Date.now();
const parts = [];

function addFilePart(fieldName, filename, buf) {
  parts.push(Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\n` +
    `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`
  ));
  parts.push(buf);
  parts.push(Buffer.from('\r\n'));
}

addFilePart('recetas', 'pedidos_ejemplo.xlsx', buffer);
addFilePart('pedidos', 'pedidos_ejemplo.xlsx', buffer);
parts.push(Buffer.from(`--${boundary}--\r\n`));

const body = Buffer.concat(parts);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const result = { statusCode: res.statusCode, body: data };
    fs.writeFileSync('/tmp/upload-result.json', JSON.stringify(result, null, 2));
    console.log('UPLOAD:', res.statusCode, data);
    
    if (res.statusCode === 200) {
      // Now test calculate
      const opts2 = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/calculate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };
      const req2 = http.request(opts2, (res2) => {
        let d2 = '';
        res2.on('data', (c) => d2 += c);
        res2.on('end', () => {
          fs.writeFileSync('/tmp/calculate-result.json', d2);
          console.log('CALCULATE:', res2.statusCode, d2.substring(0, 500));
        });
      });
      req2.on('error', (e) => console.log('ERR2:', e.message));
      req2.end();
    }
  });
});

req.on('error', (e) => {
  console.log('ERR:', e.message);
  fs.writeFileSync('/tmp/upload-result.json', JSON.stringify({error: e.message}));
});

req.write(body);
req.end();

setTimeout(() => process.exit(0), 5000);