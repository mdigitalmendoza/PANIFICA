const express = require('express');
const router = express.Router();
const { explodeBOM } = require('../services/bomEngine');
const { sampleRecetas, samplePedidos } = require('../utils/sampleData');

/**
 * POST /api/calculate
 * Ejecuta BOM engine con datos en memoria.
 */
router.post('/', (req, res) => {
  let recetas = req.app.locals.recetas;
  let pedidos = req.app.locals.pedidos;

  // Fallback a sample data para desarrollo si no hay datos subidos
  if (!recetas || !pedidos) {
    console.log('Usando datos de ejemplo para el cálculo...');
    recetas = recetas || sampleRecetas;
    pedidos = pedidos || samplePedidos;
  }

  try {
    const result = explodeBOM(recetas, pedidos);
    req.app.locals.lastBOM = result; // Guardar para sugerencias
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
