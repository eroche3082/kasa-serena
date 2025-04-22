import OpenAI from "openai";
import { DesignParams, DesignResult } from "./designGenerator";

// El modelo más reciente de OpenAI es "gpt-4o" que fue lanzado el 13 de mayo de 2024. No cambiar esto a menos que sea solicitado explícitamente por el usuario
const openai = new OpenAI({ 
  apiKey: import.meta.env.OPENAI_API_KEY 
});

// Función para analizar imágenes subidas
export async function analyzeDesignImage(base64Image: string, projectType: string): Promise<{
  description: string;
  style: string;
  materials: string[];
  colors: string[];
  recommendations: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "Eres un experto en diseño de interiores especializado en " + 
            (projectType === 'cocina' ? "cocinas" : 
             projectType === 'puerta' ? "puertas" : 
             projectType === 'ventana' ? "ventanas" : 
             projectType === 'gabinete' ? "gabinetes" : "interiores") + 
            " personalizadas. Analiza la imagen proporcionada y responde en español. " +
            "Proporciona análisis detallados de elementos de diseño, materiales, colores, y recomendaciones."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza esta imagen de ${projectType} y proporciona la siguiente información:
              1. Una descripción detallada
              2. El estilo de diseño
              3. Lista de materiales identificados
              4. Paleta de colores identificada
              5. 3-5 recomendaciones para mejorar o complementar el diseño
              
              Responde en formato JSON con las siguientes claves: 
              description, style, materials (array), colors (array), recommendations (array)`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
    });
    
    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    
    return {
      description: result.description || "No se pudo analizar la descripción",
      style: result.style || "Estilo no identificado",
      materials: Array.isArray(result.materials) ? result.materials : [],
      colors: Array.isArray(result.colors) ? result.colors : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };
  } catch (error: any) {
    console.error("Error analizando la imagen:", error);
    throw new Error(`Error al analizar la imagen: ${error.message}`);
  }
}

// Función para generar previsualizaciones basadas en descripciones
export async function generateDesignPreview(description: string, style: string, materials: string[], projectType: string): Promise<string> {
  try {
    const prompt = `Genera una imagen realista de ${
      projectType === 'cocina' ? "una cocina" : 
      projectType === 'puerta' ? "una puerta" : 
      projectType === 'ventana' ? "una ventana" : 
      projectType === 'gabinete' ? "un gabinete" : "un espacio interior"
    } con las siguientes características:
    
    Descripción: ${description}
    Estilo: ${style}
    Materiales: ${materials.join(", ")}
    
    La imagen debe ser fotorrealista, con buena iluminación, y mostrar los detalles de los materiales y colores mencionados.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || "";
  } catch (error: any) {
    console.error("Error generando previsualización:", error);
    throw new Error(`Error al generar la previsualización: ${error.message}`);
  }
}

// Función para obtener sugerencias de diseño
export async function getDesignSuggestions(projectType: string, style: string, materials: string[]): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un experto diseñador de interiores con amplia experiencia en tendencias actuales y materiales de construcción. Responde en español."
        },
        {
          role: "user",
          content: `Dame 5 sugerencias específicas para mejorar o complementar un diseño de ${
            projectType === 'cocina' ? "cocina" : 
            projectType === 'puerta' ? "puerta" : 
            projectType === 'ventana' ? "ventana" : 
            projectType === 'gabinete' ? "gabinete" : "espacio interior"
          } con estilo ${style} y que utiliza estos materiales: ${materials.join(", ")}.
          
          Responde con un array JSON de 5 sugerencias cortas y específicas.`
        }
      ],
      response_format: { type: "json_object" },
    });
    
    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    return Array.isArray(result.suggestions) ? result.suggestions : [];
  } catch (error: any) {
    console.error("Error obteniendo sugerencias:", error);
    throw new Error(`Error al obtener sugerencias: ${error.message}`);
  }
}

// Función para estimar costos basados en el diseño
export async function estimateDesignCost(projectType: string, materials: string[], size: string): Promise<{
  estimatedCost: { min: number, max: number },
  timeFrame: string,
  breakdown: { [key: string]: number }
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un experto estimador de costos para proyectos de construcción y diseño de interiores en Puerto Rico. Conoces los precios actuales de materiales y mano de obra en el mercado local. Responde en español."
        },
        {
          role: "user",
          content: `Estima el costo para un proyecto de ${
            projectType === 'cocina' ? "cocina" : 
            projectType === 'puerta' ? "puerta" : 
            projectType === 'ventana' ? "ventana" : 
            projectType === 'gabinete' ? "gabinete" : "diseño interior"
          } con las siguientes características:
          
          Tamaño/Dimensiones: ${size}
          Materiales: ${materials.join(", ")}
          Ubicación: Puerto Rico
          
          Proporciona un rango de costo estimado, un plazo aproximado, y un desglose del costo por categorías principales.
          Responde en formato JSON con las siguientes claves: 
          estimatedCost (con min y max en USD), timeFrame (string), breakdown (objeto con categorías y valores)`
        }
      ],
      response_format: { type: "json_object" },
    });
    
    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    
    return {
      estimatedCost: result.estimatedCost || { min: 0, max: 0 },
      timeFrame: result.timeFrame || "No disponible",
      breakdown: result.breakdown || {}
    };
  } catch (error: any) {
    console.error("Error estimando costos:", error);
    throw new Error(`Error al estimar costos: ${error.message}`);
  }
}

// Generador de diseño personalizado con IA
export async function generateDesign(params: DesignParams): Promise<DesignResult> {
  try {
    // 1. Genera la imagen basada en los parámetros
    const imagePrompt = `Genera una imagen realista de ${
      params.tipo === 'cocina' ? "una cocina" : 
      params.tipo === 'puerta' ? "una puerta" : 
      params.tipo === 'ventana' ? "una ventana" : 
      params.tipo === 'gabinete' ? "un gabinete" : 
      params.tipo === 'piscina' ? "una piscina" : "un elemento arquitectónico"
    } con las siguientes características:
    
    Material: ${params.material}
    Color: ${params.color}
    Estilo: ${params.estilo}
    Dimensiones: ${params.medidas}
    ${params.extra ? `Características adicionales: ${params.extra}` : ""}
    
    La imagen debe ser fotorrealista, con buena iluminación, y mostrar los detalles de los materiales y colores mencionados.`;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = imageResponse.data[0].url || "";

    // 2. Genera la descripción y los detalles
    const detailsPrompt = `Proporciona los siguientes detalles para un diseño de ${params.tipo} con estas características:
    
    Material: ${params.material}
    Color: ${params.color}
    Estilo: ${params.estilo}
    Dimensiones: ${params.medidas}
    ${params.extra ? `Características adicionales: ${params.extra}` : ""}
    
    Proporciona en formato JSON:
    1. Una descripción detallada del diseño y consejos de instalación (clave: "description")
    2. Una lista de materiales necesarios (clave: "materials" como array)
    3. Tiempo estimado de producción (clave: "estimatedTime" como string)`;

    const detailsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un experto en diseño arquitectónico y construcción con amplia experiencia en materiales, estilos y procesos de producción. Responde en español."
        },
        {
          role: "user",
          content: detailsPrompt
        }
      ],
      response_format: { type: "json_object" },
    });
    
    const details = JSON.parse(detailsResponse.choices[0].message.content);
    
    return {
      imageUrl,
      description: details.description || "No se pudo generar una descripción",
      materials: Array.isArray(details.materials) ? details.materials : [],
      estimatedTime: details.estimatedTime || "Tiempo no disponible"
    };
  } catch (error: any) {
    console.error("Error generando diseño:", error);
    throw new Error(`Error al generar el diseño: ${error.message}`);
  }
}