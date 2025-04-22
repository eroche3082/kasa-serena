// Tipos para el generador de diseño visual con IA

// Parámetros para la generación de diseño
export interface DesignParams {
  tipo: 'puerta' | 'ventana' | 'cocina' | 'gabinete' | 'piscina' | string;
  material: string;
  color: string;
  estilo: string;
  medidas: string;
  extra?: string;
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