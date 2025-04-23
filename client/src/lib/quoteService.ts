import { apiRequest } from "@/lib/queryClient";

/**
 * Interface para los datos de cotización
 */
export interface QuoteData {
  tipo: string;
  datos: Record<string, any>;
  imageUrl: string;
  descripcion: string;
}

/**
 * Envía una solicitud de cotización
 * @param quoteData Los datos de la cotización
 * @returns La respuesta de la API
 */
export async function submitQuote(quoteData: QuoteData) {
  try {
    const response = await apiRequest('POST', '/api/quotes', {
      details: {
        tipo: quoteData.tipo,
        datos: quoteData.datos,
        imageUrl: quoteData.imageUrl,
        descripcion: quoteData.descripcion,
        fechaSolicitud: new Date().toISOString()
      },
      status: 'pending'
    });

    if (!response.ok) {
      throw new Error(`Error al enviar la cotización: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al enviar la cotización:', error);
    throw new Error(`Error al enviar la cotización: ${error.message}`);
  }
}

/**
 * Obtiene las cotizaciones del usuario actual
 * @returns Lista de cotizaciones
 */
export async function getUserQuotes() {
  try {
    const response = await apiRequest('GET', '/api/quotes');

    if (!response.ok) {
      throw new Error(`Error al obtener las cotizaciones: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al obtener las cotizaciones:', error);
    throw new Error(`Error al obtener las cotizaciones: ${error.message}`);
  }
}