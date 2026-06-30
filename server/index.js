require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;

app.use('/api/upload', require('./routes/upload'));
app.use('/api/calculate', require('./routes/calculate'));
app.use('/api/suggestions', require('./routes/suggestions'));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'online', 
    memoryData: {
      hasRecetas: !!app.locals.recetas,
      hasPedidos: !!app.locals.pedidos
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Panifica Backend running on port ${PORT}`);
  console.log('Routes loaded: /api/upload, /api/calculate, /api/suggestions');
});