import OpenAI from "openai";
import { log } from './vite';

// El modelo más reciente de OpenAI es "gpt-4o" que fue lanzado el 13 de mayo de 2024. No cambiar esto a menos que sea solicitado explícitamente por el usuario
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeImage(imageBase64: string, projectType: string) {
  try {
    log(`Analizando imagen con OpenAI para proyecto tipo: ${projectType}`, 'openai');
    
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
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    log(`Análisis completado exitosamente`, 'openai');
    
    return {
      description: result.description || "No se pudo analizar la descripción",
      style: result.style || "Estilo no identificado",
      materials: Array.isArray(result.materials) ? result.materials : [],
      colors: Array.isArray(result.colors) ? result.colors : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };
  } catch (error: any) {
    log(`Error analizando la imagen: ${error.message}`, 'openai');
    throw new Error(`Error al analizar la imagen: ${error.message}`);
  }
}

export async function generateDesignPreview(description: string, style: string, materials: string[], projectType: string) {
  try {
    log(`Generando previsualización para ${projectType}`, 'openai');
    
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

    log(`Previsualización generada exitosamente`, 'openai');
    return response.data[0].url;
  } catch (error: any) {
    log(`Error generando previsualización: ${error.message}`, 'openai');
    throw new Error(`Error al generar la previsualización: ${error.message}`);
  }
}

export async function estimateDesignCost(projectType: string, materials: string[], size: string) {
  try {
    log(`Estimando costos para proyecto de ${projectType}`, 'openai');
    
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
    
    const result = JSON.parse(response.choices[0].message.content);
    log(`Estimación de costos completada exitosamente`, 'openai');
    
    return {
      estimatedCost: result.estimatedCost || { min: 0, max: 0 },
      timeFrame: result.timeFrame || "No disponible",
      breakdown: result.breakdown || {}
    };
  } catch (error: any) {
    log(`Error estimando costos: ${error.message}`, 'openai');
    throw new Error(`Error al estimar costos: ${error.message}`);
  }
}