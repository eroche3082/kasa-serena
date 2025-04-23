// Re-exportamos los componentes principales de la feature
export { default as SmartContainerGenerator } from './SmartContainerGenerator';

// Las siguientes constantes pueden usarse para centralizar los tipos, rutas o propiedades específicas
export const SMART_CONTAINER_API_ENDPOINT = '/api/smart-container';

// Tipos específicos de Smart Container
export interface SmartContainerParams {
  uso: string;        // Casa, Oficina, Spa, Café, Estudio Creativo
  tamaño: string;     // 20 pies, 40 pies, Tiny, Doble Nivel, Modular
  energia: string;    // Solar, Eólica, Mixta, Paneles + Batería
  fachada: string;    // Madera minimalista, Aluminio negro, Verde natural
  tech: string;       // Control por app, Sensores de clima, Cámaras, Luces inteligentes
  extras?: string;    // Paneles móviles, Jardines verticales, Techo verde
}