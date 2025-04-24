import fs from 'fs';
import path from 'path';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

/**
 * Sistema básico de logging para la aplicación
 */
class Logger {
  private logDir: string;
  private logPath: string;
  private errorLogPath: string;
  private isProduction: boolean;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Crear directorio de logs si no existe
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // Generar nombre de archivo con fecha
    const date = new Date().toISOString().split('T')[0];
    this.logPath = path.join(this.logDir, `app-${date}.log`);
    this.errorLogPath = path.join(this.logDir, `error-${date}.log`);
  }
  
  /**
   * Registra un mensaje en el archivo de log y consola
   */
  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (meta) {
      // Convertir metadata a formato legible
      const metaString = typeof meta === 'object' 
        ? JSON.stringify(meta, null, 2) 
        : meta.toString();
        
      logMessage += `\n${metaString}`;
    }
    
    // Siempre mostrar en consola en desarrollo
    if (!this.isProduction || level === LogLevel.ERROR) {
      console.log(logMessage);
    }
    
    // Escribir en archivo en producción
    if (this.isProduction) {
      try {
        fs.appendFileSync(this.logPath, logMessage + '\n');
        
        // Los errores se guardan en un archivo separado
        if (level === LogLevel.ERROR) {
          fs.appendFileSync(this.errorLogPath, logMessage + '\n');
        }
      } catch (err) {
        console.error('Error al escribir en el archivo de log:', err);
      }
    }
  }
  
  /**
   * Registra un mensaje informativo
   */
  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }
  
  /**
   * Registra una advertencia
   */
  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }
  
  /**
   * Registra un error
   */
  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }
  
  /**
   * Registra información de depuración (solo en desarrollo)
   */
  debug(message: string, meta?: any): void {
    if (!this.isProduction) {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }
  
  /**
   * Registra información de una solicitud HTTP
   */
  request(req: any, res: any, duration: number): void {
    const { method, url, ip } = req;
    const { statusCode } = res;
    
    this.info(`${method} ${url} ${statusCode} - ${duration}ms - ${ip}`);
    
    // Registrar errores con más detalle
    if (statusCode >= 400) {
      this.warn(`Request error: ${method} ${url} ${statusCode}`, {
        params: req.params,
        query: req.query,
        headers: req.headers,
        duration
      });
    }
  }
}

// Exportar una instancia única
export const logger = new Logger();
export default logger;