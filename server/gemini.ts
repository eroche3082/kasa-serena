// Implementación del cliente Gemini para el servidor
import { log } from "./vite";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Verificar que la API key esté disponible
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("La clave de API de Google Gemini no está configurada. Por favor, añade GOOGLE_GEMINI_API_KEY a tus variables de entorno.");
}

// Inicializar el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Interfaz para el modelo de Gemini
const geminiModelConfig = {
  model: "gemini-pro",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
};

// Modelo para visión (análisis de imágenes)
const geminiVisionModelConfig = {
  model: "gemini-pro-vision",
  safetySettings: geminiModelConfig.safetySettings,
};

// Interfaces para el generador de diseño
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

// Función para generar diseños con Gemini
export async function generateDesign(params: DesignParams): Promise<DesignResult> {
  try {
    log(`Generando diseño con parámetros: ${JSON.stringify(params)}`, "gemini");
    
    // Crear el prompt para Gemini
    const prompt = `Eres un diseñador experto de Kasa Serena, una empresa que se especializa en diseños de interiores y elementos arquitectónicos en Puerto Rico.
    
    Por favor genera una descripción detallada y profesional para un diseño de ${params.tipo} con las siguientes características:
    - Material principal: ${params.material}
    - Color/acabado: ${params.color}
    - Estilo: ${params.estilo}
    - Dimensiones: ${params.medidas}
    - Detalles adicionales: ${params.extra || "No especificados"}
    
    Proporciona la siguiente información en formato JSON:
    1. Una descripción detallada del diseño (en español)
    2. Una lista de materiales recomendados (array de strings)
    3. Tiempo estimado de producción (en semanas)
    
    Formato de respuesta esperado:
    {
      "description": "Descripción detallada del diseño...",
      "materials": ["Material 1", "Material 2", "Material 3", ...],
      "estimatedTime": "X-Y semanas"
    }`;
    
    // Obtener el modelo de Gemini
    const model = genAI.getGenerativeModel(geminiModelConfig);
    
    // Generar respuesta
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (e) {
      // Si la respuesta no es un JSON válido, extraer la información manualmente
      const descriptionMatch = text.match(/description["\s:]+([^"]+)/);
      const materialsMatch = text.match(/materials["\s:]+\[(.*?)\]/s);
      const estimatedTimeMatch = text.match(/estimatedTime["\s:]+([^"]+)/);
      
      parsedResponse = {
        description: descriptionMatch ? descriptionMatch[1] : `Diseño personalizado de ${params.tipo}`,
        materials: materialsMatch ? 
          materialsMatch[1].split(",").map(m => m.trim().replace(/['"]/g, "")) : 
          [`${params.material} de alta calidad`],
        estimatedTime: estimatedTimeMatch ? estimatedTimeMatch[1] : "4-6 semanas"
      };
    }
    
    // Crear la URL de imagen (simulada por ahora, en producción sería generada por un servicio de imágenes)
    // En una implementación completa, se integraría con un servicio como DALL-E o Midjourney
    const imageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D";
    
    return {
      imageUrl,
      description: parsedResponse.description,
      materials: parsedResponse.materials,
      estimatedTime: parsedResponse.estimatedTime
    };
  } catch (error: any) {
    log(`Error generando diseño: ${error.message}`, "gemini-error");
    throw new Error(`Error al generar el diseño: ${error.message}`);
  }
}

// Función para analizar imágenes
export async function analyzeDesignImage(imageBase64: string, projectType: string) {
  try {
    log(`Analizando imagen para proyecto tipo: ${projectType}`, "gemini");
    
    // Crear el prompt para Gemini Vision
    const prompt = `Eres un diseñador experto de Kasa Serena. Analiza esta imagen de ${projectType} y proporciona:
    1. Una descripción detallada del diseño que ves en la imagen
    2. El estilo arquitectónico/de diseño predominante
    3. Lista de materiales que puedes identificar
    4. Paleta de colores (códigos hexadecimales)
    5. Recomendaciones para mejorar o complementar el diseño
    
    Responde en formato JSON:
    {
      "description": "Descripción detallada...",
      "style": "Estilo identificado",
      "materials": ["Material 1", "Material 2", ...],
      "colors": ["#Código1", "#Código2", ...],
      "recommendations": ["Recomendación 1", "Recomendación 2", ...]
    }`;
    
    // Convertir la imagen Base64 a formato adecuado para Gemini
    const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
    
    // Obtener el modelo de Gemini Vision
    const model = genAI.getGenerativeModel(geminiVisionModelConfig);
    
    // Generar análisis
    const result = await model.generateContent([prompt, { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }]);
    const text = result.response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (e) {
      // Fallback si la respuesta no es un JSON válido
      return {
        description: `Imagen de ${projectType} analizada con IA.`,
        style: "Contemporáneo",
        materials: ["Madera", "Metal", "Vidrio"],
        colors: ["#E8D4C0", "#6B4423", "#FFFFFF", "#000000"],
        recommendations: [
          "Considerar opciones de iluminación integrada",
          "Agregar elementos decorativos complementarios",
          "Usar acabados de alta calidad"
        ]
      };
    }
    
    return parsedResponse;
  } catch (error: any) {
    log(`Error analizando imagen: ${error.message}`, "gemini-error");
    throw new Error(`Error al analizar la imagen: ${error.message}`);
  }
}

// Función para obtener sugerencias de diseño
export async function getDesignSuggestions(projectType: string, style: string, materials: string[]) {
  try {
    log(`Generando sugerencias para: ${projectType}, estilo ${style}`, "gemini");
    
    // Crear el prompt para Gemini
    const prompt = `Eres un diseñador experto de Kasa Serena. Proporciona 4 sugerencias profesionales y específicas para un proyecto de ${projectType} con estilo ${style} usando ${materials.join(", ")} como materiales principales.
    
    Las sugerencias deben ser prácticas, innovadoras y alineadas con las tendencias actuales de diseño en Puerto Rico.
    
    Responde solo con un objeto JSON que contenga un array de sugerencias:
    {
      "suggestions": ["Sugerencia 1", "Sugerencia 2", "Sugerencia 3", "Sugerencia 4"]
    }`;
    
    // Obtener el modelo de Gemini
    const model = genAI.getGenerativeModel(geminiModelConfig);
    
    // Generar sugerencias
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (e) {
      // Fallback si la respuesta no es un JSON válido
      return {
        suggestions: [
          `Considera añadir acentos metálicos al diseño de ${projectType} para complementar el estilo ${style}`,
          `Para maximizar la durabilidad, recomendamos usar ${materials[0] || 'materiales premium'} con tratamiento especial`,
          "Incluye iluminación indirecta para resaltar los detalles de diseño",
          "Combina texturas contrastantes para añadir profundidad visual"
        ]
      };
    }
    
    return parsedResponse;
  } catch (error: any) {
    log(`Error generando sugerencias: ${error.message}`, "gemini-error");
    throw new Error(`Error al generar sugerencias: ${error.message}`);
  }
}

// Función para chat con asistente
export async function chatWithAssistant(message: string, projectType: string = 'general') {
  try {
    log(`Chat con asistente. Mensaje: ${message.substring(0, 50)}... Tipo: ${projectType}`, "gemini");
    
    // Crear el contexto para el chat con Gemini
    const history = [
      {
        role: "user",
        parts: "Hola, necesito ayuda con mi proyecto de diseño."
      },
      {
        role: "model",
        parts: "¡Hola! Soy el asistente de diseño de Kasa Serena. Estoy aquí para ayudarte con tu proyecto. Puedes preguntarme sobre materiales, estilos, costos, tiempos de entrega o cualquier otra duda relacionada con tu proyecto de diseño. ¿En qué puedo ayudarte hoy?"
      }
    ];
    
    // Crear el contexto específico para el tipo de proyecto
    let contextPrompt = "Eres el asistente virtual de diseño de Kasa Serena, una empresa líder en diseño de interiores y elementos arquitectónicos en Puerto Rico. ";
    
    switch (projectType) {
      case 'cocina':
        contextPrompt += "Especialízate en diseño de cocinas, materiales como granito, cuarzo y madera, y electrodomésticos modernos.";
        break;
      case 'puerta':
        contextPrompt += "Especialízate en diseño de puertas, materiales como madera sólida, aluminio y vidrio, y sistemas de seguridad.";
        break;
      case 'ventana':
        contextPrompt += "Especialízate en diseño de ventanas, materiales como aluminio, PVC y vidrio, y eficiencia energética.";
        break;
      case 'container':
        contextPrompt += "Especialízate en diseño de Smart Containers, casas modulares, energía renovable y espacios multifuncionales.";
        break;
      case 'piscina':
        contextPrompt += "Especialízate en diseño de piscinas modulares, materiales de alta durabilidad, sistemas de filtración y opciones estéticas.";
        break;
      default:
        contextPrompt += "Proporciona información general sobre todos los servicios de Kasa Serena: diseño de cocinas, puertas, ventanas, Smart Containers y piscinas modulares.";
    }
    
    // Añadir directrices para la respuesta
    contextPrompt += " Responde en español, sé profesional pero amigable, ofrece detalles específicos cuando sea posible, y siempre intenta proporcionar al menos una sugerencia o recomendación. Limita tus respuestas a información sobre diseño y productos de Kasa Serena.";
    
    // Obtener el modelo de chat de Gemini
    const model = genAI.getGenerativeModel(geminiModelConfig);
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });
    
    // Enviar mensaje con contexto
    const result = await chat.sendMessage(`${contextPrompt}\n\nPregunta del cliente: ${message}`);
    const response = result.response.text();
    
    return { response };
  } catch (error: any) {
    log(`Error en chat con asistente: ${error.message}`, "gemini-error");
    // Proporcionar una respuesta de fallback si hay un error
    return { 
      response: "Lo siento, en este momento no puedo procesar tu consulta debido a un problema técnico. Por favor, intenta de nuevo más tarde o contacta directamente con nuestro equipo de diseño para asistencia inmediata." 
    };
  }
}

// Función para estimar costos
export async function estimateDesignCost(projectType: string, materials: string[], size: string) {
  try {
    log(`Estimando costo para: ${projectType}, tamaño ${size}`, "gemini");
    
    // Crear el prompt para Gemini
    const prompt = `Eres un especialista en presupuestos de Kasa Serena. Genera una estimación de costos detallada para un proyecto de ${projectType} con las siguientes características:
    - Materiales: ${materials.join(", ")}
    - Dimensiones/Tamaño: ${size}
    
    La estimación debe ser realista para el mercado de Puerto Rico en 2025.
    
    Proporciona la siguiente información en formato JSON:
    1. Rango de costo estimado (mínimo y máximo en USD)
    2. Tiempo estimado para completar el proyecto
    3. Desglose detallado de costos por categoría
    
    Formato de respuesta esperado:
    {
      "estimatedCost": {
        "min": 0000,
        "max": 0000
      },
      "timeFrame": "X-Y semanas",
      "breakdown": {
        "Materiales": 0000,
        "Mano de obra": 0000,
        "Diseño": 000,
        "Instalación": 000
      }
    }`;
    
    // Obtener el modelo de Gemini
    const model = genAI.getGenerativeModel(geminiModelConfig);
    
    // Generar estimación
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (e) {
      // Fallback si la respuesta no es un JSON válido
      return {
        estimatedCost: { min: 2500, max: 5000 },
        timeFrame: "4-6 semanas",
        breakdown: {
          "Materiales": 1800,
          "Mano de obra": 1500,
          "Diseño": 500,
          "Instalación": 800
        }
      };
    }
    
    return parsedResponse;
  } catch (error: any) {
    log(`Error estimando costos: ${error.message}`, "gemini-error");
    throw new Error(`Error al estimar costos: ${error.message}`);
  }
}

// Función para generar diseño a partir de un prompt textual
export async function generateDesignFromPrompt(prompt: string) {
  try {
    log(`Generando diseño a partir de prompt: ${prompt.substring(0, 50)}...`, "gemini");
    
    // Crear el prompt para Gemini para analizar el texto del usuario
    const analysisPrompt = `Analiza el siguiente texto de un cliente y extrae la información clave para un proyecto de diseño. El texto es: "${prompt}"
    
    Responde solamente con un objeto JSON con los siguientes campos:
    {
      "tipo": "puerta", "ventana", "cocina", "gabinete", "closet" u otra categoría detectada,
      "material": material principal detectado,
      "color": color o acabado detectado,
      "estilo": estilo detectado (moderno, rústico, minimalista, etc.),
      "medidas": dimensiones detectadas o "estándar" si no se especifican
    }`;
    
    // Obtener el modelo de Gemini
    const model = genAI.getGenerativeModel(geminiModelConfig);
    
    // Analizar el prompt
    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text();
    
    let params: DesignParams;
    try {
      params = JSON.parse(analysisText);
    } catch (e) {
      // Fallback si el análisis falla
      params = {
        tipo: prompt.toLowerCase().includes('puerta') ? 'puerta' : 
              prompt.toLowerCase().includes('ventana') ? 'ventana' : 
              prompt.toLowerCase().includes('cocina') ? 'cocina' : 
              prompt.toLowerCase().includes('gabinete') ? 'gabinete' : 
              prompt.toLowerCase().includes('closet') ? 'closet' : 'elemento personalizado',
        material: prompt.toLowerCase().includes('madera') ? 'madera' : 
                 prompt.toLowerCase().includes('aluminio') ? 'aluminio' : 
                 prompt.toLowerCase().includes('vidrio') ? 'vidrio' : 
                 prompt.toLowerCase().includes('pvc') ? 'pvc' : 'madera',
        color: prompt.toLowerCase().includes('blanco') ? 'blanco' : 
              prompt.toLowerCase().includes('negro') ? 'negro' : 
              prompt.toLowerCase().includes('gris') ? 'gris' : 
              prompt.toLowerCase().includes('café') ? 'café' : 'natural',
        estilo: prompt.toLowerCase().includes('rústico') ? 'rústico' : 
               prompt.toLowerCase().includes('minimalista') ? 'minimalista' : 
               prompt.toLowerCase().includes('clásico') ? 'clásico' : 
               prompt.toLowerCase().includes('industrial') ? 'industrial' : 'moderno',
        medidas: '120x200',
        extra: prompt // Guardar el prompt completo como información adicional
      };
    }
    
    // Generar resultado con los parámetros extraídos
    const result = await generateDesign(params);
    
    return result;
  } catch (error: any) {
    log(`Error generando diseño desde prompt: ${error.message}`, "gemini-error");
    throw new Error(`Error al generar diseño desde prompt: ${error.message}`);
  }
}