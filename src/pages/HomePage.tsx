import { useMemo, useState } from 'react';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { calcularCobertura } from '../lib/cobertura';
import type { FiltroRapido } from '../types';
import { MedicamentoCard } from '../components/MedicamentoCard';

const filtros: FiltroRapido[] = ['todos', 'receta pendiente', 'receta utilizada', 'sin receta', 'proxima a vencer', 'vencidos'];

export function HomePage() {
  const { medicamentos, loading, eliminar, reordenar, mensaje, limpiarMensaje } = useMedicamentos();
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState<FiltroRapido>('todos');

  const filtrados = useMemo(() => {
    return medicamentos
      .filter((m) => {
        const matchQ = `${m.droga} ${m.marcaPreferida ?? ''} ${(m.marcasAlternativas ?? []).join(' ')}`.toLowerCase().includes(q.toLowerCase());
        if (!matchQ) return false;
        const cobertura = calcularCobertura(m);
        switch (filtro) {
          case 'receta pendiente':
            return m.estadoReceta === 'por utilizar';
          case 'receta utilizada':
            return m.estadoReceta === 'utilizada';
          case 'sin receta':
            return m.estadoReceta === 'sin receta';
          case 'proxima a vencer':
            return (cobertura.diasRestantesCobertura ?? 999) > 0 && (cobertura.diasRestantesCobertura ?? 999) <= 20;
          case 'vencidos':
            return (cobertura.diasRestantesCobertura ?? 999) <= 0;
          default:
            return true;
        }
      });
  }, [medicamentos, q, filtro]);

  const onDelete = (id: string) => {
    if (window.confirm('¿Seguro que querés eliminar este medicamento?')) {
      void eliminar(id);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      {mensaje ? <button className="mb-3 w-full rounded-xl bg-emerald-50 p-2 text-sm text-emerald-700" onClick={limpiarMensaje}>{mensaje}</button> : null}
      <input className="mb-2 w-full rounded-xl border border-slate-300 p-3" placeholder="Buscar por droga o marca" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {filtros.map((item) => (
          <button key={item} className={`whitespace-nowrap rounded-full px-3 py-2 text-sm ${filtro === item ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300'}`} onClick={() => setFiltro(item)}>{item}</button>
        ))}
      </div>

      {filtrados.map((m, index) => (
        <div key={m.id}>
          <MedicamentoCard medicamento={m} onDelete={onDelete} />
          <div className="mb-3 flex gap-2">
            <button disabled={index === 0} className="btn-secondary" onClick={() => void reordenar(index, index - 1)}>Subir</button>
            <button disabled={index === filtrados.length - 1} className="btn-secondary" onClick={() => void reordenar(index, index + 1)}>Bajar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
