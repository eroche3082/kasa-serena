// Implementación de generador de Smart Containers
import { log } from "./vite";
import { DesignResult } from "./gemini";

// Interfaz para los parámetros del Smart Container
export interface SmartContainerParams {
  uso: string;        // Casa, Oficina, Spa, Café, Estudio Creativo
  tamaño: string;     // 20 pies, 40 pies, Tiny, Doble Nivel, Modular
  energia: string;    // Solar, Eólica, Mixta, Paneles + Batería
  fachada: string;    // Madera minimalista, Aluminio negro, Verde natural
  tech: string;       // Control por app, Sensores de clima, Cámaras, Luces inteligentes
  extras?: string;    // Paneles móviles, Jardines verticales, Techo verde
}

/**
 * Función para generar el prompt para el Smart Container
 */
export function generateSmartContainerPrompt(params: SmartContainerParams): string {
  return `
You are an award-winning AI architect and designer.

Please generate a **visual design** for a **Smart Container** with the following features:
- **Intended use:** ${params.uso}
- **Size:** ${params.tamaño}
- **Renewable Energy Source:** ${params.energia}
- **Facade Style:** ${params.fachada}
- **Integrated Technology:** ${params.tech}
${params.extras ? `- **Extras:** ${params.extras}` : ''}

This Smart Container should be fully off-grid, environmentally friendly, modular and remotely controllable via a smartphone app. Show it in an outdoor setting, fully set up, as a high-end visual render. The design must be elegant, futuristic, and minimal.

Return:
1. [AI Rendered Image]
2. Architectural description
3. List of core smart features and energy sources
4. Estimated installation time
5. Suggested use cases
`;
}

/**
 * Genera un diseño de Smart Container basado en los parámetros proporcionados
 */
export async function generateSmartContainer(params: SmartContainerParams): Promise<DesignResult> {
  try {
    log(`Generando Smart Container con parámetros: ${JSON.stringify(params)}`, "smart-container");
    
    // Aquí se haría la llamada real a la API de Gemini o DALL·E
    // Por ahora, devolvemos una respuesta simulada basada en los parámetros
    
    // Determinar la imagen basada en el uso principal
    let imageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D";
    
    // Crear una descripción arquitectónica basada en los parámetros
    const description = `Smart Container modular diseñado para ${params.uso}, con ${params.tamaño} de espacio. 
    Incorpora un sistema de energía ${params.energia} autosuficiente y una fachada de ${params.fachada} 
    que combina estética y funcionalidad. El container está equipado con ${params.tech} para control 
    inteligente${params.extras ? ` y cuenta con características adicionales como ${params.extras}` : ''}.`;
    
    // Crear una lista de características inteligentes
    const features = [
      `Sistema de energía ${params.energia} con almacenamiento en baterías de litio`,
      `Control inteligente mediante ${params.tech}`,
      `Fachada de ${params.fachada} con aislamiento térmico avanzado`,
      `Sistema de climatización eficiente adaptado al tamaño ${params.tamaño}`,
      `Optimizado para uso como ${params.uso} con distribución personalizada`
    ];
    
    if (params.extras) {
      features.push(`Extras instalados: ${params.extras}`);
    }
    
    // Estimar el tiempo de instalación basado en el tamaño y complejidad
    let estimatedTime = "2-3 semanas";
    if (params.tamaño === "40pies" || params.tamaño === "doble") {
      estimatedTime = "4-6 semanas";
    } else if (params.tamaño === "modular") {
      estimatedTime = "6-8 semanas";
    }
    
    return {
      imageUrl,
      description,
      materials: features,
      estimatedTime
    };
    
  } catch (error: any) {
    log(`Error generando Smart Container: ${error.message}`, "smart-container-error");
    throw new Error(`Error al generar el Smart Container: ${error.message}`);
  }
}