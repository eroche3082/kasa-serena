import { DesignResult } from "./designGenerator";

// Interfaz para los parámetros del Smart Container
export interface SmartContainerParams {
  uso: string;        // Casa, Oficina, Spa, Café, Estudio Creativo
  tamaño: string;     // 20 pies, 40 pies, Tiny, Doble Nivel, Modular
  energia: string;    // Solar, Eólica, Mixta, Paneles + Batería
  fachada: string;    // Madera minimalista, Aluminio negro, Verde natural
  tech: string;       // Control por app, Sensores de clima, Cámaras, Luces inteligentes
  extras?: string;    // Paneles móviles, Jardines verticales, Techo verde
}

// Función para generar diseño de Smart Container
export async function generateSmartContainer(params: SmartContainerParams): Promise<DesignResult> {
  try {
    const response = await fetch('/api/smart-container', {
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
    console.error("Error generando diseño de Smart Container:", error);
    throw new Error(`Error al generar el diseño: ${error.message}`);
  }
}

// Opciones de uso para el Smart Container
export const usoOptions = [
  { value: 'casa', label: 'Casa' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'spa', label: 'Spa' },
  { value: 'cafe', label: 'Café' },
  { value: 'estudio', label: 'Estudio Creativo' }
];

// Opciones de tamaño para el Smart Container
export const tamañoOptions = [
  { value: '20pies', label: '20 pies' },
  { value: '40pies', label: '40 pies' },
  { value: 'tiny', label: 'Tiny' },
  { value: 'doble', label: 'Doble Nivel' },
  { value: 'modular', label: 'Modular' }
];

// Opciones de energía para el Smart Container
export const energiaOptions = [
  { value: 'solar', label: 'Solar' },
  { value: 'eolica', label: 'Eólica' },
  { value: 'mixta', label: 'Mixta' },
  { value: 'paneles', label: 'Paneles + Batería' }
];

// Opciones de fachada para el Smart Container
export const fachadaOptions = [
  { value: 'madera', label: 'Madera minimalista' },
  { value: 'aluminio', label: 'Aluminio negro' },
  { value: 'verde', label: 'Verde natural' }
];

// Opciones de tecnología para el Smart Container
export const techOptions = [
  { value: 'app', label: 'Control por app' },
  { value: 'sensores', label: 'Sensores de clima' },
  { value: 'camaras', label: 'Cámaras' },
  { value: 'luces', label: 'Luces inteligentes' },
  { value: 'completo', label: 'Sistema completo' }
];

// Opciones de extras para el Smart Container
export const extrasOptions = [
  { value: 'paneles', label: 'Paneles móviles' },
  { value: 'jardines', label: 'Jardines verticales' },
  { value: 'techo', label: 'Techo verde' },
  { value: 'agua', label: 'Sistema de recolección de agua' }
];