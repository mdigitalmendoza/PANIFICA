import { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import ProductionSummary from './components/ProductionSummary';
import IngredientsList from './components/IngredientsList';
import AISuggestions from './components/AISuggestions';
import { uploadFiles, calculateProduction, getSuggestions } from './api';

export default function App() {
  const [recetasFile, setRecetasFile] = useState(null);
  const [pedidosFile, setPedidosFile] = useState(null);
  const [productionData, setProductionData] = useState(null);
  const [suggestionsData, setSuggestionsData] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCalculate = recetasFile && pedidosFile;

  const handleCalculate = useCallback(async () => {
    if (!canCalculate) return;
    setLoading(true);
    setError(null);
    setProductionData(null);
    setSuggestionsData(null);
    setUploadResult(null);

    try {
      // 1. Subir ambos archivos juntos
      const uploadRes = await uploadFiles(recetasFile, pedidosFile);
      setUploadResult(uploadRes);

      // 2. Calcular producción (BOM explosion)
      const prodRes = await calculateProduction();
      setProductionData(prodRes);

      // 3. Sugerencias IA (paralelo, no bloqueante)
      getSuggestions()
        .then(setSuggestionsData)
        .catch(() => { /* silencioso, no crítico */ });
    } catch (err) {
      setError(err.message || 'Error al procesar');
    } finally {
      setLoading(false);
    }
  }, [canCalculate, recetasFile, pedidosFile]);

  const handleReset = () => {
    setRecetasFile(null);
    setPedidosFile(null);
    setProductionData(null);
    setSuggestionsData(null);
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="min-h-dvh bg-[#FFF8F0] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#8B4513] text-[#FFF8F0] px-4 py-3 shadow-lg sticky top-0 z-50">
        <div className="max-w-[480px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFF8F0] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-[#8B4513] font-black text-xl leading-none">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Panifica</h1>
              <p className="text-[0.65rem] text-[#D4A574] opacity-80 leading-tight">Panel de Producción</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#D4A574]">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
            <span>En vivo</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[480px] mx-auto w-full px-4 py-5 pb-28">
        {/* Upload section */}
        <h2 className="text-base font-bold text-stone-800 mb-3 px-1 pt-2">📋 Cargar Pedidos y Recetas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <FileUpload
            label="Archivo de Recetas"
            hint=".csv, .xlsx"
            icon="📖"
            file={recetasFile}
            onFileSelect={setRecetasFile}
          />
          <FileUpload
            label="Archivo de Pedidos"
            hint=".csv, .xlsx"
            icon="📋"
            file={pedidosFile}
            onFileSelect={setPedidosFile}
          />
        </div>

        <button
          className="flex items-center justify-center gap-2 w-full h-[52px] bg-[#C17F3B] text-white border-none rounded-2xl text-lg font-bold cursor-pointer transition-all duration-200 disabled:bg-stone-300 disabled:cursor-not-allowed active:scale-[0.98] hover:bg-[#A8652A] shadow-md"
          disabled={!canCalculate || loading}
          onClick={handleCalculate}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              Calculando...
            </>
          ) : (
            '🚀 Calcular Producción'
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-4 text-center">
            <p className="text-sm font-medium text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* Upload result summary */}
        {uploadResult && !error && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mt-4 text-center">
            <p className="text-xs text-green-700 font-medium">
              ✓ Recetas cargadas: {uploadResult.recetasCount ?? '—'} · Pedidos: {uploadResult.pedidosCount ?? '—'} líneas
              <span className="ml-3 underline cursor-pointer font-bold" onClick={handleReset}>Reiniciar</span>
            </p>
          </div>
        )}

        {/* Results */}
        {productionData && (
          <>
            <div className="mt-6" />
            <ProductionSummary data={productionData} loading={false} />
            <IngredientsList data={productionData} loading={false} />
            <AISuggestions data={suggestionsData} loading={false} error={error} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-stone-200 px-4 py-2 text-xs text-stone-400 z-50">
        <div className="max-w-[480px] mx-auto flex justify-between">
          <span>Panifica — Panel de Producción</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}