import { useState } from 'react';
import type { EstadoReceta, Medicamento } from '../types';

interface Props {
  initial?: Medicamento;
  onSubmit: (medicamento: Medicamento) => Promise<void>;
}

const estados: EstadoReceta[] = ['por utilizar', 'utilizada', 'sin receta'];

export function MedicamentoForm({ initial, onSubmit }: Props) {
  const [error, setError] = useState('');
  const [data, setData] = useState<Medicamento>(
    initial ?? {
      id: crypto.randomUUID(),
      droga: '',
      dosisCantidad: 0,
      dosisUnidad: 'mg',
      cantidadComprimidosPorCaja: 0,
      comprimidosPorDia: 1,
      fechaInicioCajaActual: '',
      estadoReceta: 'sin receta',
      activo: true,
      marcasAlternativas: [],
      ordenManual: 9999
    }
  );

  const update = (key: keyof Medicamento, value: string | number | boolean | string[] | undefined) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.droga || !data.fechaInicioCajaActual || data.dosisCantidad <= 0 || data.cantidadComprimidosPorCaja <= 0 || data.comprimidosPorDia <= 0) {
      setError('Completá los campos obligatorios con valores válidos.');
      return;
    }
    if (data.stockActualCajas !== undefined && data.stockActualCajas < 0) return setError('El stock no puede ser negativo.');
    if (data.stockActualComprimidosSueltos !== undefined && data.stockActualComprimidosSueltos < 0) return setError('El stock no puede ser negativo.');

    setError('');
    await onSubmit(data);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="field"><span>Droga *</span><input value={data.droga} onChange={(e) => update('droga', e.target.value)} required /></label>
      <label className="field"><span>Nombre comercial</span><input value={data.nombreComercial ?? ''} onChange={(e) => update('nombreComercial', e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label className="field"><span>Dosis *</span><input type="number" step="0.1" min="0" value={data.dosisCantidad} onChange={(e) => update('dosisCantidad', Number(e.target.value))} required /></label>
        <label className="field"><span>Unidad *</span><select value={data.dosisUnidad} onChange={(e) => update('dosisUnidad', e.target.value as Medicamento['dosisUnidad'])}><option>mg</option><option>mcg</option><option>g</option><option>ml</option><option>otra</option></select></label>
      </div>
      <label className="field"><span>Comprimidos por caja *</span><input type="number" min="1" value={data.cantidadComprimidosPorCaja} onChange={(e) => update('cantidadComprimidosPorCaja', Number(e.target.value))} required /></label>
      <label className="field"><span>Comprimidos por día *</span><input type="number" step="0.1" min="0.1" value={data.comprimidosPorDia} onChange={(e) => update('comprimidosPorDia', Number(e.target.value))} required /></label>
      <label className="field"><span>Inicio caja actual *</span><input type="date" value={data.fechaInicioCajaActual} onChange={(e) => update('fechaInicioCajaActual', e.target.value)} required /></label>
      <label className="field"><span>Número de receta</span><input value={data.numeroReceta ?? ''} onChange={(e) => update('numeroReceta', e.target.value)} /></label>
      <label className="field"><span>Estado receta *</span><select value={data.estadoReceta} onChange={(e) => update('estadoReceta', e.target.value as EstadoReceta)}>{estados.map((e) => <option key={e}>{e}</option>)}</select></label>
      <label className="field"><span>Marca preferida</span><input value={data.marcaPreferida ?? ''} onChange={(e) => update('marcaPreferida', e.target.value)} /></label>
      <label className="field"><span>Marcas alternativas (separadas por coma)</span><input value={(data.marcasAlternativas ?? []).join(', ')} onChange={(e) => update('marcasAlternativas', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} /></label>
      <label className="field"><span>Color de etiqueta</span><input type="color" value={data.colorEtiqueta ?? '#0f172a'} onChange={(e) => update('colorEtiqueta', e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-2">
        <label className="field"><span>Stock cajas extra</span><input type="number" min="0" value={data.stockActualCajas ?? ''} onChange={(e) => update('stockActualCajas', e.target.value ? Number(e.target.value) : undefined)} /></label>
        <label className="field"><span>Stock sueltos</span><input type="number" min="0" value={data.stockActualComprimidosSueltos ?? ''} onChange={(e) => update('stockActualComprimidosSueltos', e.target.value ? Number(e.target.value) : undefined)} /></label>
      </div>
      <label className="field"><span>Observaciones</span><textarea value={data.observaciones ?? ''} onChange={(e) => update('observaciones', e.target.value)} rows={3} /></label>
      <label className="inline-flex items-center gap-2"><input type="checkbox" checked={data.activo} onChange={(e) => update('activo', e.target.checked)} /><span>Medicamento activo</span></label>
      {error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}
      <button type="submit" className="btn-primary w-full">Guardar</button>
    </form>
  );
}
