const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseSheet } = require('../utils/fileParser');
const { validateUpload } = require('../middleware/validation');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB total
});

/**
 * POST /api/upload
 * Recibe archivos, parsea y guarda en memoria.
 */
router.post('/', 
  upload.fields([{ name: 'recetas', maxCount: 1 }, { name: 'pedidos', maxCount: 1 }]), 
  validateUpload,
  (req, res) => {
    try {
      const parsedData = parseSheet(req.files);
      
      // Guardar en req.app.locals como solicitó el lead
      if (parsedData.recetas.length > 0) req.app.locals.recetas = parsedData.recetas;
      if (parsedData.pedidos.length > 0) req.app.locals.pedidos = parsedData.pedidos;

      res.status(200).json({
        recetasCount: parsedData.recetas.length,
        pedidosCount: parsedData.pedidos.length,
        productos: [...new Set(parsedData.pedidos.map(p => p.Producto))],
        clientes: [...new Set(parsedData.pedidos.map(p => p.Cliente))]
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
