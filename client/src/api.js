const API_BASE = '/api';

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { Accept: 'application/json' },
    ...opts,
  };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
    config.headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, config);
  if (!res.ok) {
    const text = await res.text().catch(() => 'Error de conexión');
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}

/** Sube ambos archivos (recetas + pedidos) en un solo request multipart */
export function uploadFiles(recetasFile, pedidosFile) {
  const form = new FormData();
  form.append('recetas', recetasFile);
  form.append('pedidos', pedidosFile);
  return request('/upload', { method: 'POST', body: form });
}

/** Calcula la producción usando los datos ya subidos en memoria */
export function calculateProduction() {
  return request('/calculate', { method: 'POST' });
}

/** Obtiene sugerencias del asistente IA */
export function getSuggestions() {
  return request('/suggestions');
}