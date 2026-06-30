const { parseSheet } = require('./utils/fileParser');

// Simular los archivos como los enviaría multer
const fs = require('fs');
const xlsx = require('xlsx');

const buffer = fs.readFileSync('../samples/pedidos_ejemplo.xlsx');

const mockFiles = {
  recetas: [{ buffer, mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', originalname: 'pedidos_ejemplo.xlsx' }],
  pedidos: [{ buffer, mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', originalname: 'pedidos_ejemplo.xlsx' }]
};

try {
  const result = parseSheet(mockFiles);
  console.log('✅ parseSheet EXITOSO');
  console.log('Recetas:', result.recetas.length, 'filas');
  console.log('  Primeras 3:', JSON.stringify(result.recetas.slice(0, 3)));
  console.log('Pedidos:', result.pedidos.length, 'filas');
  console.log('  Primeras 3:', JSON.stringify(result.pedidos.slice(0, 3)));

  // Probar BOM engine
  const { explodeBOM } = require('./services/bomEngine');
  const bom = explodeBOM(result.recetas, result.pedidos);
  console.log('\n✅ BOM Engine EXITOSO');
  console.log('Productos:', JSON.stringify(bom.productos));
  console.log('Ingredientes:', JSON.stringify(bom.ingredientes));
  console.log('Total pedidos:', bom.totalPedidos);
} catch (e) {
  console.error('❌ ERROR:', e.message);
}