import { useNavigate, useParams } from 'react-router-dom';
import { MedicamentoForm } from '../components/MedicamentoForm';
import { useMedicamentos } from '../hooks/useMedicamentos';

export function FormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { medicamentos, agregar, actualizar } = useMedicamentos();
  const existing = medicamentos.find((m) => m.id === id);

  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold">{existing ? 'Editar medicamento' : 'Nuevo medicamento'}</h1>
      <MedicamentoForm
        initial={existing}
        onSubmit={async (m) => {
          if (existing) await actualizar(m);
          else {
            const maxOrden = Math.max(...medicamentos.map((med) => med.ordenManual), -1);
            await agregar({ ...m, ordenManual: maxOrden + 1 });
          }
          navigate('/');
        }}
      />
    </div>
  );
}
