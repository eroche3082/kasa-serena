// Re-exportamos los componentes principales de la feature
export { default as ModularPoolDesigner } from './ModularPoolDesigner';

// Las siguientes constantes pueden usarse para centralizar los tipos, rutas o propiedades específicas
export const MODULAR_POOL_API_ENDPOINT = '/api/pool-designer';

// Tipos específicos de Modular Pool
export interface PoolParams {
  forma: string;        // Rectangular, Cuadrada, Circular, Infinity
  tamaño: string;       // 3x2m, 5x3m, 6x4m, etc.
  profundidad: string;  // 1.2m, 1.5m, 2m
  vidrio: string;       // Sin vidrio, Un lado de vidrio, Todo en acrílico
  acabados: string;     // Mosaico azul, Cemento pulido, Mármol blanco, Pasto sintético
  extras?: string;      // Panel solar, Calentador, Iluminación LED, Escalones internos
  estilo: string;       // Minimalista, Lujo, Tropical, Moderno
  entorno: string;      // Patio urbano, Casa en la montaña, Jardín tropical
}