const { parse } = require('csv-parse/sync');
const xlsx = require('xlsx');

/**
 * Validates column names for a given data set.
 * @param {Array} data - Array of objects
 * @param {Array} expectedColumns - Array of strings
 */
const validateColumns = (data, expectedColumns) => {
  if (!data || data.length === 0) return;
  const actualColumns = Object.keys(data[0]);
  const missing = expectedColumns.filter(col => !actualColumns.includes(col));
  if (missing.length > 0) {
    throw new Error(`Columnas faltantes: ${missing.join(', ')}`);
  }
};

/**
 * Reads a named sheet from an XLSX workbook.
 * Falls back to the first sheet if the named one is not found.
 */
const parseSheetByName = (buffer, sheetName) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const names = workbook.SheetNames;
  // Try exact match first, then case-insensitive
  let target = names.find(n => n === sheetName);
  if (!target) target = names.find(n => n.toLowerCase() === sheetName.toLowerCase());
  // Fallback to first sheet
  if (!target) target = names[0];
  const worksheet = workbook.Sheets[target];
  return xlsx.utils.sheet_to_json(worksheet);
};

/**
 * Parses a single buffer (CSV or XLSX) into JSON.
 */
const parseBuffer = (buffer, mimetype, originalname, sheetName) => {
  if (mimetype === 'text/csv' || originalname.endsWith('.csv')) {
    return parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
    originalname.endsWith('.xlsx')
  ) {
    if (sheetName) {
      return parseSheetByName(buffer, sheetName);
    }
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const target = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[target]);
  } else {
    throw new Error('Formato de archivo no soportado. Use CSV o XLSX.');
  }
};

/**
 * Main parseSheet function.
 * Recibe los archivos de multer y parsea según el tipo.
 * Soporta:
 * - Archivos separados (recetas.csv + pedidos.csv)
 * - Un solo XLSX con hojas nombradas "Recetas" y "Pedidos"
 * - Google Sheets API (fase 2): mismo contrato de datos
 */
const parseSheet = (files) => {
  const result = { recetas: [], pedidos: [] };

  if (files.recetas) {
    const f = files.recetas[0];
    // Si es XLSX, intentar leer hoja "Recetas" por nombre
    const sheetName = (f.mimetype?.includes('spreadsheet') || f.originalname?.endsWith('.xlsx'))
      ? 'Recetas' : undefined;
    result.recetas = parseBuffer(f.buffer, f.mimetype, f.originalname, sheetName);
    validateColumns(result.recetas, ['Producto', 'Ingrediente', 'Cantidad_Gramos']);
  }

  if (files.pedidos) {
    const f = files.pedidos[0];
    // Si es XLSX, intentar leer hoja "Pedidos" por nombre
    const sheetName = (f.mimetype?.includes('spreadsheet') || f.originalname?.endsWith('.xlsx'))
      ? 'Pedidos' : undefined;
    result.pedidos = parseBuffer(f.buffer, f.mimetype, f.originalname, sheetName);
    validateColumns(result.pedidos, ['Cliente', 'Producto', 'Cantidad_Pedida', 'Unidad_Pedida']);
  }

  return result;
};

module.exports = { parseSheet };
