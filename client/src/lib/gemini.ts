// This is a helper file for communicating with the Google Gemini API

// For a real implementation, we would use the Gemini SDK/API directly
// For this project, we'll use our server as a proxy for Gemini API calls
export async function analyzeImage(imageFile: File, projectType: string) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('projectType', projectType);
  
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

// Generate design suggestions based on user input
export async function generateDesignSuggestions(prompt: string) {
  try {
    // In a real implementation, this would call the Gemini API
    // For now, we'll return mock data based on the prompt
    const suggestions = [];
    
    if (prompt.includes('cocina')) {
      suggestions.push(
        'Considera una isla central para maximizar el espacio de trabajo',
        'Iluminación LED bajo los gabinetes para mejor visibilidad',
        'Gabinetes hasta el techo para aprovechar el espacio vertical'
      );
    } else if (prompt.includes('puerta')) {
      suggestions.push(
        'Puertas con paneles para resistencia a la intemperie',
        'Madera tratada para ambientes costeros',
        'Bisagras de acero inoxidable para prevenir corrosión'
      );
    } else if (prompt.includes('ventana')) {
      suggestions.push(
        'Ventanas de doble vidrio para mayor aislamiento',
        'Marcos de aluminio con recubrimiento marino',
        'Sellos impermeables para prevenir filtraciones'
      );
    } else {
      suggestions.push(
        'Diseño modular para adaptabilidad futura',
        'Colores claros para ampliar visualmente el espacio',
        'Combinación de texturas para añadir interés visual'
      );
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error generating design suggestions:', error);
    throw error;
  }
}

// Chat with AI assistant
export async function chatWithAssistant(message: string, history: Array<{role: string, content: string}> = []) {
  try {
    // In a real implementation, this would call the Gemini API
    // For now, we'll simulate responses based on keywords in the message
    let response = '';
    
    if (message.toLowerCase().includes('material')) {
      response = 'Para ambientes en Puerto Rico, recomendamos materiales resistentes a la humedad y salinidad. Nuestros laminados hidrófugos, cuarzo sellado y maderas tratadas son excelentes opciones para cocinas y gabinetes expuestos a condiciones costeras.';
    } else if (message.toLowerCase().includes('costo') || message.toLowerCase().includes('precio')) {
      response = 'El costo varía según el tamaño y materiales seleccionados. Un proyecto de cocina típico oscila entre $4,000 y $8,000, mientras que puertas y ventanas personalizadas pueden costar desde $800 a $2,500 por unidad. ¿Te gustaría una cotización personalizada?';
    } else if (message.toLowerCase().includes('tiempo') || message.toLowerCase().includes('entrega')) {
      response = 'Nuestro tiempo de entrega promedio es de 3-4 semanas para cocinas y gabinetes, y 2-3 semanas para puertas y ventanas. Este período incluye fabricación e instalación. Trabajamos con un cronograma detallado que compartimos al iniciar el proyecto.';
    } else if (message.toLowerCase().includes('distribuid') || message.toLowerCase().includes('proveedor')) {
      response = 'Trabajamos con distribuidores locales como Maderas del Caribe en San Juan, Isla Surfaces en Ponce y Herrajes Modernos en Mayagüez. Esto nos permite ofrecer materiales de alta calidad con disponibilidad garantizada.';
    } else {
      response = 'Gracias por tu mensaje. En Kasa Serena Designs nos especializamos en diseño y construcción personalizada de cocinas, puertas, ventanas y gabinetes. ¿En qué podemos ayudarte específicamente?';
    }
    
    return {
      role: 'assistant',
      content: response
    };
  } catch (error) {
    console.error('Error chatting with assistant:', error);
    throw error;
  }
}
