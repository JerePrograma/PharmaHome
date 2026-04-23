import { Link, useParams } from 'react-router-dom';
import { useMedicamentos } from '../hooks/useMedicamentos';
import { calcularCobertura } from '../lib/cobertura';
import { formatDate } from '../lib/format';

export function DetallePage() {
  const { id } = useParams();
  const { medicamentos } = useMedicamentos();
  const m = medicamentos.find((item) => item.id === id);

  if (!m) return <p>Medicamento no encontrado.</p>;
  const c = calcularCobertura(m);

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">{m.droga}</h1>
      <p className="rounded-xl bg-white p-3">Dosis: {m.dosisCantidad} {m.dosisUnidad}</p>
      <p className="rounded-xl bg-white p-3">Caja: {m.cantidadComprimidosPorCaja} comprimidos</p>
      <p className="rounded-xl bg-white p-3">Toma diaria: {m.comprimidosPorDia}</p>
      <p className="rounded-xl bg-white p-3">Receta: {m.estadoReceta} {m.numeroReceta ? `(${m.numeroReceta})` : ''}</p>
      <p className="rounded-xl bg-white p-3">Marca preferida: {m.marcaPreferida || 'No cargada'}</p>
      <p className="rounded-xl bg-white p-3">Marcas alternativas: {(m.marcasAlternativas ?? []).join(', ') || 'Sin alternativas'}</p>
      <p className="rounded-xl bg-white p-3">Hasta cobertura: {c.calculable ? formatDate(c.fechaCoberturaEstimada) : 'Cálculo incompleto'}</p>
      <p className="rounded-xl bg-white p-3">Días restantes: {c.calculable ? c.diasRestantesCobertura : '—'}</p>
      <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800">Cómo se calculó: {c.detalleCalculo}</p>
      <Link to={`/editar/${m.id}`} className="btn-primary inline-flex">Editar</Link>
    </section>
  );
}
