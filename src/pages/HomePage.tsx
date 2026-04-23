import { useMemo, useState } from 'react';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { calcularCobertura } from '../lib/cobertura';
import type { FiltroRapido, Medicamento } from '../types';
import { MedicamentoCard } from '../components/MedicamentoCard';

const filtros: FiltroRapido[] = ['todos', 'receta pendiente', 'receta utilizada', 'sin receta', 'proxima a vencer', 'vencidos'];

function moverPorId(items: Medicamento[], id: string, direction: -1 | 1) {
  const fullIndex = items.findIndex((m) => m.id === id);
  if (fullIndex < 0) return items;

  const target = fullIndex + direction;
  if (target < 0 || target >= items.length) return items;

  const next = [...items];
  const [item] = next.splice(fullIndex, 1);
  next.splice(target, 0, item);

  return next.map((med, index) => ({ ...med, ordenManual: index }));
}

export function HomePage() {
  const { medicamentos, loading, eliminar, reordenar, mensaje, limpiarMensaje } = useMedicamentos();
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState<FiltroRapido>('todos');

  const filtrados = useMemo(() => {
    return medicamentos.filter((m) => {
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

  const moverFiltrado = (id: string, direction: -1 | 1) => {
    const normalized = moverPorId(medicamentos, id, direction);
    const from = medicamentos.findIndex((m) => m.id === id);
    const to = normalized.findIndex((m) => m.id === id);
    if (from >= 0 && to >= 0 && from !== to) {
      void reordenar(from, to);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      {mensaje ? <button className="mb-3 w-full rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800" onClick={limpiarMensaje}>{mensaje}</button> : null}
      <input className="mb-2 w-full rounded-2xl border border-rose-200 bg-white p-3 text-base text-fuchsia-900" placeholder="Buscar por droga o marca" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {filtros.map((item) => (
          <button key={item} className={`whitespace-nowrap rounded-full px-3 py-2 text-sm ${filtro === item ? 'bg-fuchsia-800 text-white' : 'bg-white border border-rose-200 text-fuchsia-800'}`} onClick={() => setFiltro(item)}>{item}</button>
        ))}
      </div>

      {filtrados.map((m, index) => (
        <div key={m.id}>
          <MedicamentoCard medicamento={m} onDelete={onDelete} />
          <div className="mb-3 flex gap-2">
            <button disabled={index === 0} className="btn-secondary" onClick={() => moverFiltrado(m.id, -1)}>Subir</button>
            <button disabled={index === filtrados.length - 1} className="btn-secondary" onClick={() => moverFiltrado(m.id, 1)}>Bajar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
