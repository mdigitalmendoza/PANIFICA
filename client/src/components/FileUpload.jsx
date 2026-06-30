import { useState, useRef } from 'react';

export default function FileUpload({ label, hint, icon, onFileSelect, file }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) onFileSelect?.(f);
  };

  return (
    <div
      className="border-2 border-dashed border-amber-300 rounded-2xl p-5 text-center cursor-pointer bg-white/70 hover:bg-amber-50 transition-all duration-200"
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
    >
      <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleChange} />
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-semibold text-stone-800">{label}</p>
      <p className="text-xs text-stone-500 mt-1">{hint}</p>
      {file && (
        <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-medium">
          {file.name}
        </span>
      )}
    </div>
  );
}