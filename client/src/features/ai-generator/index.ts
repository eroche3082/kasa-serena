// Re-exportamos los componentes principales de la feature
export { default as ChatDesignGenerator } from './ChatDesignGenerator';
export { default as PromptDesignGenerator } from './PromptDesignGenerator';
export { default as DesignGenerator } from './DesignGenerator';

// Las siguientes constantes pueden usarse para centralizar los tipos, rutas o propiedades específicas
export const DESIGN_CHAT_API_ENDPOINT = '/api/design-chat';
export const GENERATE_DESIGN_API_ENDPOINT = '/api/generate-design';
export const DESIGN_FROM_PROMPT_API_ENDPOINT = '/api/design-from-prompt';

// Tipos específicos del Generador AI
export interface DesignParams {
  tipo: string;
  material: string;
  color: string;
  estilo: string;
  medidas: string;
  extra?: string;
}

export interface DesignResult {
  imageUrl: string;
  description: string;
  materials: string[];
  estimatedTime: string;
}