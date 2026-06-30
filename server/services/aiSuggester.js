const axios = require('axios');

/**
 * AI Suggester
 * Asíncrono con prevención de almacenamiento
 */
const generateSuggestions = async (productionSummary, pedidosHistoricos = []) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const orgId = process.env.OPENAI_ORG_ID;

  if (!apiKey || apiKey === 'your_key_here') {
    return { suggestions: [], message: "IA no configurada" };
  }

  try {
    const prompt = `
Eres un experto en gestión de panaderías artesanales. Analiza el siguiente resumen de producción actual y compáralo con los pedidos históricos (si se proveen).

PRODUCCIÓN ACTUAL:
${JSON.stringify(productionSummary, null, 2)}

HISTÓRICO:
${JSON.stringify(pedidosHistoricos, null, 2)}

Tu tarea:
1. Identificar clientes cuyo pedido actual es significativamente diferente del histórico.
2. Detectar picos anómalos por producto.
3. Entregar sugerencias operativas breves para optimizar la producción y minimizar mermas.

Responde de forma directa, profesional y en español.
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Asistente de producción para panaderías.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        user: 'panifica-backend' // Ayuda a OpenAI a segmentar datos (no almacenamiento)
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          ...(orgId && { 'OpenAI-Organization': orgId })
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return {
      suggestions: content.split('\n').filter(line => line.trim().length > 0),
      message: "Sugerencias generadas con éxito"
    };
  } catch (error) {
    console.error('Error en AI Suggester:', error.response?.data || error.message);
    return { 
      suggestions: [], 
      message: "Hubo un error al procesar las sugerencias de IA." 
    };
  }
};

module.exports = { generateSuggestions };
