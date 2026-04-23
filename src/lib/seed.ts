import type { Medicamento } from '../types';

export const medicamentosSeed: Medicamento[] = [
  {
    id: crypto.randomUUID(),
    droga: 'Lorazepam',
    dosisCantidad: 2.5,
    dosisUnidad: 'mg',
    cantidadComprimidosPorCaja: 100,
    comprimidosPorDia: 1,
    fechaInicioCajaActual: '2026-04-01',
    estadoReceta: 'por utilizar',
    activo: true,
    ordenManual: 0,
    marcaPreferida: 'Trafarma',
    marcasAlternativas: ['Genérico A']
  },
  {
    id: crypto.randomUUID(),
    droga: 'DBI',
    dosisCantidad: 500,
    dosisUnidad: 'mg',
    cantidadComprimidosPorCaja: 100,
    comprimidosPorDia: 2,
    fechaInicioCajaActual: '2026-04-01',
    estadoReceta: 'utilizada',
    activo: true,
    ordenManual: 1,
    marcaPreferida: 'Laboratorio B'
  },
  {
    id: crypto.randomUUID(),
    droga: 'T4',
    dosisCantidad: 137,
    dosisUnidad: 'mcg',
    cantidadComprimidosPorCaja: 50,
    comprimidosPorDia: 1,
    fechaInicioCajaActual: '2026-04-05',
    estadoReceta: 'sin receta',
    activo: true,
    ordenManual: 2,
    marcaPreferida: 'T4 Bagó'
  }
];
