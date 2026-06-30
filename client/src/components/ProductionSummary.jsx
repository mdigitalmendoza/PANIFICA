export default function ProductionSummary({ data, loading }) {
  if (loading) {
    return (
      <Section title="🥖 Resumen de Producción">
        {[1,2,3].map(i => <div key={i} className="h-14 bg-stone-100 rounded-xl animate-pulse mb-2" />)}
      </Section>
    );
  }

  if (!data?.productos?.length) {
    return (
      <Section title="🥖 Resumen de Producción">
        <div className="text-center py-8 text-stone-400 text-sm">Sube pedidos y recetas para ver el plan de producción.</div>
      </Section>
    );
  }

  return (
    <Section title="🥖 Resumen de Producción">
      {data.productos.map((p, i) => (
        <div
          key={p.nombre || i}
          className="bg-white rounded-xl px-4 py-3 shadow-sm border-l-4 border-l-amber-800 flex items-center justify-between mb-2"
          style={{ animation: `slideUp 0.3s ease-out ${i * 60}ms both` }}
        >
          <div className="min-w-0 flex-1">
            <div className="font-bold text-stone-800 text-sm truncate">{p.nombre}</div>
          </div>
          <div className="text-right ml-3 flex-shrink-0">
            <span className="text-lg font-black text-amber-900">{Number(p.cantidadTotal).toLocaleString('es')}</span>
            <span className="text-xs text-stone-500 ml-1">unid</span>
          </div>
        </div>
      ))}
      <div className="mt-3 text-center text-xs text-stone-500 bg-amber-50 rounded-xl py-2 px-3">
        Total: <strong>{data.productos.reduce((s, p) => s + Number(p.cantidadTotal || 0), 0).toLocaleString('es')} piezas</strong> · {data.productos.length} productos · {data.totalPedidos || '—'} pedidos
      </div>
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