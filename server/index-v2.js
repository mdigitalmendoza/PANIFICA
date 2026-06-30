require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/upload', require('./routes/upload'));
app.use('/api/calculate', require('./routes/calculate'));
app.use('/api/suggestions', require('./routes/suggestions'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', parser: 'v2-hojas-por-nombre' });
});

// Serve frontend build
const frontendDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'not found' });
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Panifica v2 corriendo en puerto ${PORT}`);
  console.log(`   API: /api/upload, /api/calculate, /api/suggestions`);
  console.log(`   Frontend: servido como static desde ${frontendDist}`);
});