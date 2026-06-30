const express = require('express');
const router = express.Router();
const { generateSuggestions } = require('../services/aiSuggester');

/**
 * GET /api/suggestions
 * Obtiene sugerencias IA del último cálculo.
 */
router.get('/', async (req, res) => {
  const productionSummary = req.app.locals.lastBOM;

  if (!productionSummary) {
    return res.status(400).json({ error: 'Primero debe ejecutar el cálculo (/api/calculate)' });
  }

  // En un caso real, pasaríamos el histórico desde una DB
  const historicalData = []; 

  try {
    const result = await generateSuggestions(productionSummary, historicalData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
