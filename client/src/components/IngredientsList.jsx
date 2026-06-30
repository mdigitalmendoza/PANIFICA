export default function IngredientsList({ data, loading }) {
  if (loading) {
    return (
      <Section title="🧂 Ingredientes Necesarios">
        {[1,2,3,4].map(i => <div key={i} className="h-10 bg-stone-100 rounded-xl animate-pulse mb-1" />)}
      </Section>
    );
  }

  if (!data?.ingredientes?.length) {
    return (
      <Section title="🧂 Ingredientes Necesarios">
        <div className="text-center py-8 text-stone-400 text-sm">Los ingredientes aparecerán al procesar los pedidos.</div>
      </Section>
    );
  }

  return (
    <Section title="🧂 Ingredientes Necesarios">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {data.ingredientes.map((item, i) => {
          const grams = Number(item.cantidadTotalGramos || 0);
          const [qty, unit] = grams >= 1000
            ? [(grams / 1000).toFixed(1), 'kg']
            : [Math.round(grams).toString(), 'g'];
          return (
            <div
              key={item.nombre || i}
              className={`flex justify-between items-center px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}`}
              style={{ animation: `slideUp 0.25s ease-out ${i * 40}ms both` }}
            >
              <span className="font-medium text-stone-700">{item.nombre}</span>
              <span className="font-bold text-amber-900 whitespace-nowrap ml-3">{qty} {unit}</span>
            </div>
          );
        })}
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