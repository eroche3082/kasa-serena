// Tipos compartidos entre cliente y servidor

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

// Parámetros para análisis de imagen
export interface ImageAnalysisParams {
  image: string;
  projectType: string;
}

// Resultado del análisis de imagen
export interface ImageAnalysisResult {
  description: string;
  style: string;
  materials: string[];
  colors: string[];
  recommendations: string[];
}

// Parámetros para sugerencias de diseño
export interface DesignSuggestionParams {
  projectType: string;
  style: string;
  materials: string[];
}

// Resultado de sugerencias de diseño
export interface DesignSuggestionResult {
  suggestions: string[];
}

// Parámetros para estimación de costos
export interface CostEstimationParams {
  projectType: string;
  materials: string[];
  size: string;
}

// Resultado de estimación de costos
export interface CostEstimationResult {
  estimatedCost: {
    min: number;
    max: number;
  };
  timeFrame: string;
  breakdown: {
    [key: string]: number;
  };
}