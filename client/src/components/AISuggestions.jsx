export default function AISuggestions({ data, loading, error }) {
  if (loading) {
    return (
      <Section title="🤖 Sugerencias del Asistente">
        <div className="bg-amber-50/50 rounded-2xl p-6 text-center border border-amber-200/30">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-sm text-stone-500">Analizando pedidos...</p>
        </div>
      </Section>
    );
  }

  const isApiKeyError = error?.toLowerCase().includes('api key')
    || error?.toLowerCase().includes('api_key')
    || error?.toLowerCase().includes('no configurada');

  if (isApiKeyError) {
    return (
      <Section title="🤖 Sugerencias del Asistente">
        <div className="bg-amber-50/50 rounded-2xl p-6 text-center border border-amber-200/30">
          <div className="text-3xl mb-2">🔌</div>
          <p className="text-sm font-semibold text-stone-600">Conecta una API de IA</p>
          <p className="text-xs text-stone-400 mt-1">Configura una API key de IA en el archivo .env para recibir sugerencias inteligentes.</p>
        </div>
      </Section>
    );
  }

  // Backend devuelve data.suggestions como string[]
  const suggestions = data?.suggestions;
  if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
    return (
      <Section title="🤖 Sugerencias del Asistente">
        <div className="bg-amber-50/50 rounded-2xl p-6 text-center border border-amber-200/30">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm font-semibold text-stone-600">No hay anomalías detectadas</p>
          <p className="text-xs text-stone-400 mt-1">El asistente monitorea cambios en los pedidos y te alertará sobre picos o bajas inesperadas.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section title="🤖 Sugerencias del Asistente">
      {suggestions.map((texto, i) => (
        <div
          key={i}
          className="bg-blue-50 border-l-4 border-blue-400 rounded-xl px-4 py-3 mb-2"
          style={{ animation: `slideUp 0.3s ease-out ${i * 80}ms both` }}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
            <p className="text-sm font-medium text-blue-800">{texto}</p>
          </div>
        </div>
      ))}
    </Section>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-5">
      <h2 className="text-base font-bold text-stone-800 mb-3 px-1">{title}</h2>
      {children}
    </section>
  );
}