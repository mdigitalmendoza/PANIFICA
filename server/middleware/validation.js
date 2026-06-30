const path = require('path');

/**
 * Validates file upload extension and size.
 */
const validateUpload = (req, res, next) => {
  if (!req.files || (!req.files.recetas && !req.files.pedidos)) {
    return res.status(400).json({ error: 'Debe subir al menos un archivo (recetas o pedidos).' });
  }

  const allowedExtensions = ['.csv', '.xlsx'];
  const allFiles = [...(req.files.recetas || []), ...(req.files.pedidos || [])];

  for (const file of allFiles) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: `Formato no permitido: ${file.originalname}. Use CSV o XLSX.` });
    }
    
    // Limitar a 5MB (ya manejado por multer, pero aquí lo validamos por archivo si se desea)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: `Archivo demasiado grande: ${file.originalname}. Máximo 5MB.` });
    }
  }

  next();
};

module.exports = { validateUpload };
