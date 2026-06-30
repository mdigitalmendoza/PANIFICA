const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/upload', require('./routes/upload'));
app.use('/api/calculate', require('./routes/calculate'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.get('/health', (req, res) => res.json({ status: 'online' }));
app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Panifica BACKEND v2 corriendo en puerto 3000');
  console.log('   Rutas: /api/upload, /api/calculate, /api/suggestions');
  console.log('   Parser con lectura por nombre de hoja ACTIVADO');
});