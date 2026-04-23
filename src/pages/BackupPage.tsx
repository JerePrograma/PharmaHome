import { useRef } from 'react';
import { useMedicamentos } from '../hooks/useMedicamentos';
import type { Medicamento } from '../types';

function toCsv(items: Medicamento[]) {
  const headers = ['droga', 'dosisCantidad', 'dosisUnidad', 'cantidadComprimidosPorCaja', 'comprimidosPorDia', 'fechaInicioCajaActual', 'estadoReceta', 'marcaPreferida'];
  const lines = items.map((m) => headers.map((h) => JSON.stringify((m as unknown as Record<string, unknown>)[h] ?? '')).join(','));
  return [headers.join(','), ...lines].join('\n');
}

export function BackupPage() {
  const { medicamentos, importar } = useMedicamentos();
  const inputRef = useRef<HTMLInputElement>(null);

  const exportarJson = () => {
    const blob = new Blob([JSON.stringify(medicamentos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmahome-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarCsv = () => {
    const blob = new Blob([toCsv(medicamentos)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmahome.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarJson = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as Medicamento[];
    if (!Array.isArray(parsed)) throw new Error('Formato inválido');
    if (!window.confirm('Esto reemplaza todos los datos actuales. ¿Continuar?')) return;
    await importar(parsed);
  };

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold">Backup y exportación</h1>
      <button className="btn-primary w-full" onClick={exportarJson}>Exportar backup JSON</button>
      <button className="btn-secondary w-full" onClick={exportarCsv}>Exportar CSV simple</button>
      <button className="btn-secondary w-full" onClick={() => inputRef.current?.click()}>Importar JSON</button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void importarJson(file);
        }}
      />
      <p className="text-sm text-slate-600">Tip: guardá el JSON en Drive o WhatsApp para tener respaldo.</p>
    </section>
  );
}
