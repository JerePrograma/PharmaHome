import type { Medicamento } from '../types';

const MS_DIA = 1000 * 60 * 60 * 24;

export interface CoberturaResultado {
  calculable: boolean;
  motivoIncompleto?: string;
  totalComprimidos?: number;
  diasCobertura?: number;
  fechaCoberturaEstimada?: string;
  diasRestantesCobertura?: number;
  detalleCalculo: string;
}

export function calcularCobertura(m: Medicamento, hoy = new Date()): CoberturaResultado {
  if (!m.cantidadComprimidosPorCaja || !m.comprimidosPorDia || !m.fechaInicioCajaActual) {
    return {
      calculable: false,
      motivoIncompleto: 'Faltan datos para estimar la cobertura.',
      detalleCalculo: 'Necesitás caja, comprimidos por día y fecha de inicio.'
    };
  }

  if (m.comprimidosPorDia <= 0 || m.cantidadComprimidosPorCaja <= 0) {
    return {
      calculable: false,
      motivoIncompleto: 'Los valores deben ser mayores a cero.',
      detalleCalculo: 'Revisá comprimidos por día y cantidad por caja.'
    };
  }

  const cajasExtra = Math.max(0, m.stockActualCajas ?? 0);
  const sueltos = Math.max(0, m.stockActualComprimidosSueltos ?? 0);
  const totalComprimidos = m.cantidadComprimidosPorCaja * (1 + cajasExtra) + sueltos;
  const diasCobertura = totalComprimidos / m.comprimidosPorDia;

  const inicio = new Date(`${m.fechaInicioCajaActual}T00:00:00`);
  if (Number.isNaN(inicio.getTime())) {
    return {
      calculable: false,
      motivoIncompleto: 'La fecha de inicio no es válida.',
      detalleCalculo: 'Corregí la fecha para calcular cobertura.'
    };
  }

  const diasEnteros = Math.floor(diasCobertura);
  const fechaFin = new Date(inicio.getTime() + diasEnteros * MS_DIA);
  const diasRestantesCobertura = Math.ceil((fechaFin.getTime() - hoy.getTime()) / MS_DIA);

  return {
    calculable: true,
    totalComprimidos,
    diasCobertura,
    fechaCoberturaEstimada: fechaFin.toISOString().slice(0, 10),
    diasRestantesCobertura,
    detalleCalculo: `(${m.cantidadComprimidosPorCaja} x ${1 + cajasExtra}) + ${sueltos} = ${totalComprimidos}. ${totalComprimidos} / ${m.comprimidosPorDia} = ${diasCobertura.toFixed(1)} días.`
  };
}

export function colorCobertura(diasRestantes?: number): 'verde' | 'amarillo' | 'rojo' | 'gris' {
  if (diasRestantes === undefined) return 'gris';
  if (diasRestantes <= 7) return 'rojo';
  if (diasRestantes <= 20) return 'amarillo';
  return 'verde';
}
