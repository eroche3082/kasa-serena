// Tipos para el generador de diseño visual con IA

// Parámetros para la generación de diseño
export interface DesignParams {
  // Parámetros básicos
  tipo: 'puerta' | 'ventana' | 'cocina' | 'gabinete' | 'contenedor' | 'piscina' | 'oficina' | string;
  material: string;
  color: string;
  estilo: string;
  medidas: string;
  extra?: string;
  
  // Parámetros para Contenedor Inteligente
  uso?: string;
  tamaño?: string;
  energia?: string;
  fachada?: string;
  tech?: string;
  extras?: string;
  
  // Parámetros para Piscina Modular
  forma?: string;
  profundidad?: string;
  acabados?: string;
  vidrio?: string;
  entorno?: string;
  
  // Parámetros para Oficina/Espacio Creativo
  capacidad?: string;
  tecnologia?: string;
  bienestar?: string;
  
  [key: string]: string | undefined; // Para acceso dinámico a propiedades
}

// Resultado de la generación de diseño
export interface DesignResult {
  imageUrl: string;
  description: string;
  materials: string[];
  estimatedTime: string;
}

// Categorías de materiales disponibles
export const materialCategories = [
  { id: 'madera', name: 'Maderas' },
  { id: 'metal', name: 'Metales' },
  { id: 'piedra', name: 'Piedras y mármoles' },
  { id: 'vidrio', name: 'Vidrios' },
  { id: 'ceramica', name: 'Cerámicas' },
  { id: 'sintético', name: 'Materiales sintéticos' },
];

// Estilos disponibles
export const availableStyles = [
  { id: 'moderno', name: 'Moderno' },
  { id: 'minimalista', name: 'Minimalista' },
  { id: 'clasico', name: 'Clásico' },
  { id: 'rustico', name: 'Rústico' },
  { id: 'colonial', name: 'Colonial' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'contemporaneo', name: 'Contemporáneo' },
];