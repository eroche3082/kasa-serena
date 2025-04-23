import { DesignParams, DesignResult } from "./designGenerator";

// Función para chat con asistente de diseño
export async function chatWithAssistant(message: string, projectType?: string): Promise<string> {
  try {
    const response = await fetch('/api/design-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        projectType: projectType || 'general',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la consulta: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("Error consultando al asistente:", error);
    return "Lo siento, no pude procesar tu consulta en este momento. Por favor, intenta de nuevo más tarde.";
  }
}

// Función para generar diseños usando Gemini Flash
export async function generateDesign(params: DesignParams): Promise<DesignResult> {
  try {
    console.log("Generando diseño con parámetros:", params);
    // Crear la solicitud a Vertex AI
    const response = await fetch('/api/generate-design', {
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
    console.error("Error generando diseño con Gemini:", error);
    throw new Error(`Error al generar el diseño: ${error.message}`);
  }
}

// Función para analizar imágenes usando Gemini Flash
export async function analyzeDesignImage(
  base64Image: string, 
  projectType: string
): Promise<{
  description: string;
  style: string;
  materials: string[];
  colors: string[];
  recommendations: string[];
}> {
  try {
    const response = await fetch('/api/analyze-image-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        projectType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en el análisis: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error analizando imagen con Gemini:", error);
    throw new Error(`Error al analizar la imagen: ${error.message}`);
  }
}

// Función para obtener sugerencias de diseño
export async function getDesignSuggestions(
  projectType: string, 
  style: string = "moderno", 
  materials: string[] = ["madera"]
): Promise<string[]> {
  try {
    const response = await fetch('/api/design-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectType,
        style,
        materials,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo sugerencias: ${response.statusText}`);
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error: any) {
    console.error("Error obteniendo sugerencias:", error);
    return ["No se pudieron cargar las sugerencias. Por favor, intenta de nuevo."];
  }
}

// Función para estimar costos
export async function estimateDesignCost(
  projectType: string, 
  materials: string[], 
  size: string
): Promise<{
  estimatedCost: { min: number; max: number };
  timeFrame: string;
  breakdown: { [key: string]: number };
}> {
  try {
    const response = await fetch('/api/estimate-cost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectType,
        materials,
        size,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error estimando costos: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error estimando costos:", error);
    return {
      estimatedCost: { min: 0, max: 0 },
      timeFrame: "No disponible",
      breakdown: {}
    };
  }
}