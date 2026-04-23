import { useRef, useState } from 'react';
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
  const [mensaje, setMensaje] = useState('');

  const exportarJson = () => {
    const blob = new Blob([JSON.stringify(medicamentos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmahome-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    setMensaje('Backup JSON exportado.');
  };

  const exportarCsv = () => {
    const blob = new Blob([toCsv(medicamentos)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmahome.csv';
    a.click();
    URL.revokeObjectURL(url);
    setMensaje('CSV exportado.');
  };

  const importarJson = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Medicamento[];
      if (!Array.isArray(parsed)) throw new Error('Formato inválido');
      if (!window.confirm('Esto reemplaza todos los datos actuales. ¿Continuar?')) return;
      await importar(parsed);
      setMensaje('Backup importado correctamente.');
    } catch {
      setMensaje('No se pudo importar. Revisá que sea un JSON válido exportado desde la app.');
    }
  };

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold">Backup y exportación</h1>
      {mensaje ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{mensaje}</p> : null}
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
          e.currentTarget.value = '';
        }}
      />
      <p className="text-sm text-slate-600">Tip: guardá el JSON en Drive o WhatsApp para tener respaldo.</p>
    </section>
  );
}
