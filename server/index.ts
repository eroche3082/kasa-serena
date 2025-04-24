import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger";

// Configuración de la aplicación
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Configurar para confiar en proxies (necesario para rate limiter con X-Forwarded-For)
app.set('trust proxy', 1);

// Middleware de seguridad básica
app.disable('x-powered-by'); // Eliminar el header que identifica Express

// Middleware de seguridad avanzada
app.use((req, res, next) => {
  // Configuración de cabeceras de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Para prevenir ataques de clickjacking
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.stripe.com https://storage.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://*; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.openai.com https://*.googleapis.com https://*.firebase.com https://*.stripe.com; frame-src 'self' https://*.stripe.com;");
  
  next();
});

// Configurar la limitación de tasa (rate limiting)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 solicitudes por ventana
  message: "Demasiadas solicitudes. Por favor, inténtelo de nuevo más tarde.",
  standardHeaders: true, // Devolver info de límite en los headers 'RateLimit-*'
  legacyHeaders: false, // Deshabilitar los headers 'X-RateLimit-*'
});

// Aplicar a todas las solicitudes de API
app.use("/api/", apiLimiter);

// Limiter específico para rutas de autenticación
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Limitar cada IP a 10 solicitudes de login por hora
  message: "Demasiados intentos de autenticación. Por favor, inténtelo de nuevo más tarde."
});

// Limiter específico para generadores de IA (más permisivo para usuarios autenticados)
const aiGeneratorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30, // Limitar cada IP a 30 solicitudes por hora
  message: "Has alcanzado el límite de generaciones de IA. Por favor, inténtalo de nuevo más tarde."
});

// Limiter para cotizaciones
const quoteLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 20, // Limitar cada IP a 20 solicitudes por día
  message: "Has alcanzado el límite de cotizaciones. Por favor, inténtalo de nuevo mañana."
});

// Aplicar a rutas de autenticación
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);

// Aplicar a rutas de generadores de IA
app.use("/api/generate-design", aiGeneratorLimiter);
app.use("/api/analyze-image", aiGeneratorLimiter);
app.use("/api/smart-container", aiGeneratorLimiter);
app.use("/api/modular-pool", aiGeneratorLimiter);

// Aplicar a rutas de cotizaciones
app.use("/api/quotes", quoteLimiter);
app.use("/api/quote-request", quoteLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
    
    // Usar nuestro sistema de logging para registrar información de solicitudes
    logger.request(req, res, duration);
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Registrar el error en nuestro sistema de logging
    logger.error(`Error ${status}: ${message}`, { 
      stack: err.stack, 
      path: _req.path,
      method: _req.method,
      query: _req.query,
      body: _req.body
    });

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    logger.info(`Servidor iniciado en el puerto ${port} - ${new Date().toISOString()}`);
  });
})();
