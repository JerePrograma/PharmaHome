export type DosisUnidad = 'mg' | 'mcg' | 'g' | 'ml' | 'otra';

export type EstadoReceta = 'por utilizar' | 'utilizada' | 'sin receta';

export interface Medicamento {
  id: string;
  droga: string;
  dosisCantidad: number;
  dosisUnidad: DosisUnidad;
  cantidadComprimidosPorCaja: number;
  comprimidosPorDia: number;
  fechaInicioCajaActual: string;
  numeroReceta?: string;
  estadoReceta: EstadoReceta;
  activo: boolean;
  marcaPreferida?: string;
  marcasAlternativas?: string[];
  nombreComercial?: string;
  observaciones?: string;
  colorEtiqueta?: string;
  stockActualCajas?: number;
  stockActualComprimidosSueltos?: number;
  ordenManual: number;
}

export type FiltroRapido =
  | 'todos'
  | 'receta pendiente'
  | 'receta utilizada'
  | 'sin receta'
  | 'proxima a vencer'
  | 'vencidos';
