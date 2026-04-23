/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Medicamento } from '../types';
import { medicamentosSeed } from '../lib/seed';
import { medicamentoRepo } from '../storage/db';

interface MedicamentosContextValue {
  medicamentos: Medicamento[];
  loading: boolean;
  mensaje: string;
  agregar: (m: Medicamento) => Promise<void>;
  actualizar: (m: Medicamento) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  reordenar: (from: number, to: number) => Promise<void>;
  importar: (items: Medicamento[]) => Promise<void>;
  limpiarMensaje: () => void;
}

const MedicamentosContext = createContext<MedicamentosContextValue | null>(null);

export function MedicamentosProvider({ children }: { children: React.ReactNode }) {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function init() {
      const existing = await medicamentoRepo.list();
      if (existing.length === 0) {
        await medicamentoRepo.saveMany(medicamentosSeed);
        setMedicamentos(medicamentosSeed);
      } else {
        setMedicamentos(existing);
      }
      setLoading(false);
    }
    void init();
  }, []);

  const agregar = async (m: Medicamento) => {
    await medicamentoRepo.save(m);
    setMedicamentos((prev) => [...prev, m].sort((a, b) => a.ordenManual - b.ordenManual));
    setMensaje('Medicamento guardado.');
  };

  const actualizar = async (m: Medicamento) => {
    await medicamentoRepo.save(m);
    setMedicamentos((prev) => prev.map((item) => (item.id === m.id ? m : item)).sort((a, b) => a.ordenManual - b.ordenManual));
    setMensaje('Cambios guardados.');
  };

  const eliminar = async (id: string) => {
    await medicamentoRepo.delete(id);
    setMedicamentos((prev) => prev.filter((m) => m.id !== id));
    setMensaje('Medicamento eliminado.');
  };

  const reordenar = async (from: number, to: number) => {
    setMedicamentos((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      const normalized = copy.map((m, index) => ({ ...m, ordenManual: index }));
      void medicamentoRepo.saveMany(normalized);
      return normalized;
    });
  };

  const importar = async (items: Medicamento[]) => {
    const normalized = items.map((item, index) => ({ ...item, ordenManual: index }));
    await medicamentoRepo.clear();
    await medicamentoRepo.saveMany(normalized);
    setMedicamentos(normalized);
    setMensaje('Backup importado correctamente.');
  };

  const value = useMemo(
    () => ({ medicamentos, loading, mensaje, agregar, actualizar, eliminar, reordenar, importar, limpiarMensaje: () => setMensaje('') }),
    [loading, medicamentos, mensaje]
  );

  return <MedicamentosContext.Provider value={value}>{children}</MedicamentosContext.Provider>;
}

export function useMedicamentos() {
  const ctx = useContext(MedicamentosContext);
  if (!ctx) throw new Error('useMedicamentos debe usarse dentro de MedicamentosProvider');
  return ctx;
}
