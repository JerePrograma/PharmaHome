import { describe, expect, it } from 'vitest';
import { medicamentoRepo } from './db';

describe('medicamentoRepo', () => {
  it('guarda y lista medicamentos', async () => {
    await medicamentoRepo.clear();
    await medicamentoRepo.save({
      id: 'abc',
      droga: 'A',
      dosisCantidad: 1,
      dosisUnidad: 'mg',
      cantidadComprimidosPorCaja: 10,
      comprimidosPorDia: 1,
      fechaInicioCajaActual: '2026-01-01',
      estadoReceta: 'sin receta',
      activo: true,
      ordenManual: 0
    });
    const list = await medicamentoRepo.list();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('abc');
  });
});
