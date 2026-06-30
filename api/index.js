const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/upload', require('../server/routes/upload'));
app.use('/api/calculate', require('../server/routes/calculate'));
app.use('/api/suggestions', require('../server/routes/suggestions'));
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', parser: 'v2' });
});
const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
module.exports = app;
