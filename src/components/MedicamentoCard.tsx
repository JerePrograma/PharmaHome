import { Link } from 'react-router-dom';
import { calcularCobertura, colorCobertura } from '../lib/cobertura';
import { formatDate } from '../lib/format';
import type { Medicamento } from '../types';

const colorMap = {
  verde: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  amarillo: 'bg-amber-50 text-amber-800 border-amber-200',
  rojo: 'bg-rose-50 text-rose-800 border-rose-200',
  gris: 'bg-slate-100 text-slate-700 border-slate-200'
};

export function MedicamentoCard({ medicamento, onDelete }: { medicamento: Medicamento; onDelete: (id: string) => void }) {
  const cobertura = calcularCobertura(medicamento);
  const estado = colorCobertura(cobertura.diasRestantesCobertura);

  return (
    <article className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{medicamento.droga}</h2>
          <p className="text-sm text-slate-700">{medicamento.dosisCantidad} {medicamento.dosisUnidad}</p>
        </div>
        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${colorMap[estado]}`}>{estado}</span>
      </div>
      <ul className="space-y-1 text-sm text-slate-700">
        <li>Caja: {medicamento.cantidadComprimidosPorCaja} comprimidos</li>
        <li>Toma: {medicamento.comprimidosPorDia} por día</li>
        {medicamento.marcaPreferida ? <li>Marca: {medicamento.marcaPreferida}</li> : null}
        <li>Receta: {medicamento.estadoReceta}{medicamento.numeroReceta ? ` (${medicamento.numeroReceta})` : ''}</li>
        <li>Hasta: {cobertura.calculable ? formatDate(cobertura.fechaCoberturaEstimada) : 'Cálculo incompleto'}</li>
        <li>Días restantes: {cobertura.calculable ? cobertura.diasRestantesCobertura : '—'}</li>
      </ul>
      <div className="mt-3 flex gap-2">
        <Link className="btn-secondary" to={`/medicamento/${medicamento.id}`}>Detalle</Link>
        <Link className="btn-secondary" to={`/editar/${medicamento.id}`}>Editar</Link>
        <button className="btn-danger" onClick={() => onDelete(medicamento.id)}>Eliminar</button>
      </div>
    </article>
  );
}
