import { DesignResult } from "./designGenerator";

// Interfaz para los parámetros de la piscina modular
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

// Función para generar diseño de piscina
export async function generateModularPool(params: PoolParams): Promise<DesignResult> {
  try {
    const response = await fetch('/api/pool-designer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Error en la generación: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error generando diseño de piscina:", error);
    throw new Error(`Error al generar el diseño: ${error.message}`);
  }
}

// Opciones para forma de piscina
export const formaOptions = [
  { value: 'rectangular', label: 'Rectangular' },
  { value: 'cuadrada', label: 'Cuadrada' },
  { value: 'circular', label: 'Circular' },
  { value: 'infinity', label: 'Infinity' }
];

// Opciones para tamaño de piscina
export const tamañoOptions = [
  { value: '3x2m', label: '3 x 2 metros' },
  { value: '5x3m', label: '5 x 3 metros' },
  { value: '6x4m', label: '6 x 4 metros' },
  { value: '8x4m', label: '8 x 4 metros' },
  { value: '10x5m', label: '10 x 5 metros' }
];

// Opciones para profundidad de piscina
export const profundidadOptions = [
  { value: '1.2m', label: '1.2 metros' },
  { value: '1.5m', label: '1.5 metros' },
  { value: '1.8m', label: '1.8 metros' },
  { value: '2m', label: '2 metros' }
];

// Opciones para vidrio de piscina
export const vidrioOptions = [
  { value: 'sin-vidrio', label: 'Sin vidrio' },
  { value: 'un-lado', label: 'Un lado de vidrio' },
  { value: 'todo-acrilico', label: 'Todo en acrílico' }
];

// Opciones para acabados de piscina
export const acabadosOptions = [
  { value: 'mosaico-azul', label: 'Mosaico azul' },
  { value: 'cemento-pulido', label: 'Cemento pulido' },
  { value: 'marmol-blanco', label: 'Mármol blanco' },
  { value: 'pasto-sintetico', label: 'Pasto sintético' }
];

// Opciones para extras de piscina
export const extrasOptions = [
  { value: 'panel-solar', label: 'Panel solar' },
  { value: 'calentador', label: 'Calentador' },
  { value: 'iluminacion-led', label: 'Iluminación LED' },
  { value: 'escalones-internos', label: 'Escalones internos' },
  { value: 'cascada', label: 'Cascada decorativa' }
];

// Opciones para estilo de piscina
export const estiloOptions = [
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'lujo', label: 'Lujo' },
  { value: 'tropical', label: 'Tropical' },
  { value: 'moderno', label: 'Moderno' }
];

// Opciones para entorno de piscina
export const entornoOptions = [
  { value: 'patio-urbano', label: 'Patio urbano' },
  { value: 'casa-montaña', label: 'Casa en la montaña' },
  { value: 'jardin-tropical', label: 'Jardín tropical' },
  { value: 'frente-mar', label: 'Frente al mar' }
];