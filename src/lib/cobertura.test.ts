import { describe, expect, it } from 'vitest';
import { calcularCobertura } from './cobertura';

const base = {
  id: '1',
  droga: 'Test',
  dosisCantidad: 2.5,
  dosisUnidad: 'mg' as const,
  cantidadComprimidosPorCaja: 100,
  comprimidosPorDia: 2,
  fechaInicioCajaActual: '2026-04-01',
  estadoReceta: 'sin receta' as const,
  activo: true,
  ordenManual: 0
};

describe('calcularCobertura', () => {
  it('calcula fecha y días con decimales', () => {
    const result = calcularCobertura({ ...base, comprimidosPorDia: 1.5 }, new Date('2026-04-10T00:00:00'));
    expect(result.calculable).toBe(true);
    expect(result.diasCobertura).toBeCloseTo(66.66, 1);
    expect(result.fechaCoberturaEstimada).toBe('2026-06-06');
  });

  it('incluye stock adicional', () => {
    const result = calcularCobertura({ ...base, stockActualCajas: 1, stockActualComprimidosSueltos: 10 }, new Date('2026-04-02T00:00:00'));
    expect(result.totalComprimidos).toBe(210);
    expect(result.diasCobertura).toBe(105);
  });

  it('marca incompleto cuando faltan datos', () => {
    const result = calcularCobertura({ ...base, fechaInicioCajaActual: '' });
    expect(result.calculable).toBe(false);
  });
});
