import fs from 'fs';
import path from 'path';
import heicConvert from 'heic-convert';
import { logger } from './logger';

/**
 * Utilidad para convertir imágenes HEIC a formatos web optimizados
 */
export async function convertHeicToJpeg(
  inputPath: string,
  outputPath?: string,
  quality: number = 80
): Promise<string> {
  try {
    // Si no se proporciona ruta de salida, crear una basada en la entrada
    if (!outputPath) {
      const parsedPath = path.parse(inputPath);
      outputPath = path.join(
        parsedPath.dir,
        `${parsedPath.name}.jpg`
      );
    }

    logger.info(`Convirtiendo imagen ${inputPath} a ${outputPath}`);
    
    // Leer el archivo HEIC
    const inputBuffer = fs.readFileSync(inputPath);
    
    // Convertir a JPEG
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',  // o 'PNG'
      quality: quality  // 1-100
    });
    
    // Guardar el resultado
    fs.writeFileSync(outputPath, outputBuffer);
    
    logger.info(`Imagen convertida correctamente: ${outputPath}`);
    
    return outputPath;
  } catch (error: any) {
    logger.error('Error al convertir imagen HEIC:', error);
    throw new Error(`Error al convertir imagen HEIC: ${error.message}`);
  }
}

/**
 * Genera versiones de baja calidad para carga progresiva
 */
export async function generateLowQualityImage(
  inputPath: string,
  quality: number = 20
): Promise<string> {
  try {
    const parsedPath = path.parse(inputPath);
    const lowQualityPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}-low${parsedPath.ext}`
    );
    
    // Si el archivo es HEIC, convertirlo primero
    if (parsedPath.ext.toLowerCase() === '.heic') {
      // Convertirlo a JPEG de alta calidad primero
      const jpegPath = await convertHeicToJpeg(inputPath);
      
      // Luego generar versión de baja calidad
      const jpegParsedPath = path.parse(jpegPath);
      const lowJpegPath = path.join(
        jpegParsedPath.dir,
        `${jpegParsedPath.name}-low${jpegParsedPath.ext}`
      );
      
      // Convertir a baja calidad
      await heicConvert({
        buffer: fs.readFileSync(jpegPath),
        format: 'JPEG',
        quality: quality
      }).then(buffer => {
        fs.writeFileSync(lowJpegPath, buffer);
      });
      
      return lowJpegPath;
    }
    
    // Para otras imágenes, implementar según sea necesario
    // Aquí se necesitaría usar otra biblioteca como Sharp
    logger.warn(`Generación de baja calidad no implementada para ${parsedPath.ext}`);
    return inputPath;
  } catch (error: any) {
    logger.error('Error al generar imagen de baja calidad:', error);
    throw new Error(`Error al generar imagen de baja calidad: ${error.message}`);
  }
}

export default {
  convertHeicToJpeg,
  generateLowQualityImage
};