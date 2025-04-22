import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProjectSchema, 
  insertMessageSchema, 
  insertQuoteSchema 
} from "@shared/schema";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import heicConvert from 'heic-convert';
import { log } from "./vite";
import { analyzeImage, generateDesignPreview, estimateDesignCost } from "./openai";
import { 
  generateDesign as generateDesignWithGemini, 
  analyzeDesignImage as analyzeImageWithGemini,
  getDesignSuggestions,
  estimateDesignCost as estimateDesignCostWithGemini,
  chatWithAssistant
} from "./gemini";

// Declare module to extend express-session
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// OpenAI API integration for image analysis
async function analyzeImageWithAI(imageBase64: string, projectType: string) {
  try {
    log(`Analizando imagen utilizando OpenAI para proyecto tipo: ${projectType}`, "analyze-image");
    
    // Llamar a la API de OpenAI para analizar la imagen
    const analysis = await analyzeImage(imageBase64, projectType);
    
    // Transformar la respuesta al formato esperado por el cliente
    const transformedResult = {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0
      },
      description: analysis.description,
      style: analysis.style,
      materialRecommendations: analysis.materials.map(material => ({ name: material })),
      colorPalette: analysis.colors,
      designSuggestions: analysis.recommendations,
      estimatedCost: 0,
      estimatedTime: ""
    };
    
    // Si hay suficiente información, intentar estimar costos
    try {
      const size = "Medio"; // Por defecto, podríamos extraer esto del análisis en una implementación más avanzada
      const costEstimate = await estimateDesignCost(projectType, analysis.materials, size);
      
      transformedResult.estimatedCost = costEstimate.estimatedCost.min;
      transformedResult.estimatedTime = costEstimate.timeFrame;
    } catch (costError) {
      log(`Error estimando costos: ${costError.message}`, "analyze-image");
      // No fallar el análisis completo si falla la estimación de costos
    }
    
    return transformedResult;
  } catch (error: any) {
    log(`Error en el análisis de imagen: ${error.message}`, "analyze-image");
    throw new Error(`Error en el análisis de imagen: ${error.message}`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  const SessionStore = MemoryStore(session);
  app.use(session({
    cookie: { maxAge: 86400000 },
    store: new SessionStore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "kasaserena-secret"
  }));
  
  // Helper for checking auth
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // API Routes
  // User routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Set session
      req.session.userId = user.id;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  app.get("/api/projects/user", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getProjectsByUser(req.session.userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user projects" });
    }
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  
  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this project" });
      }
      
      const updatedProject = await storage.updateProject(projectId, req.body);
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  
  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      if (project.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to delete this project" });
      }
      
      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  
  // Image analysis route with OpenAI
  app.post("/api/analyze-image", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      const projectType = req.body.projectType || "cocina";
      const imageBase64 = req.file.buffer.toString("base64");
      
      // Call OpenAI API to analyze the image
      const analysis = await analyzeImageWithAI(imageBase64, projectType);
      
      res.json(analysis);
    } catch (error: any) {
      log(`Error en el análisis de imagen: ${error.message}`, "api");
      res.status(500).json({ message: `Error en el análisis de imagen: ${error.message}` });
    }
  });
  
  // Generate design preview route
  app.post("/api/generate-preview", requireAuth, async (req, res) => {
    try {
      const { description, style, materials, projectType } = req.body;
      
      if (!description || !style || !materials || !projectType) {
        return res.status(400).json({ 
          message: "Se requieren todos los campos: description, style, materials, projectType" 
        });
      }
      
      log(`Generando previsualización para ${projectType}`, "api");
      
      // Llamada a OpenAI para generar imagen
      const imageUrl = await generateDesignPreview(
        description,
        style,
        Array.isArray(materials) ? materials : [materials],
        projectType
      );
      
      res.json({ imageUrl });
    } catch (error: any) {
      log(`Error generando previsualización: ${error.message}`, "api");
      res.status(500).json({ message: `Error generando previsualización: ${error.message}` });
    }
  });
  
  // Estimate design cost route
  app.post("/api/estimate-cost", requireAuth, async (req, res) => {
    try {
      const { projectType, materials, size } = req.body;
      
      if (!projectType || !materials || !size) {
        return res.status(400).json({ 
          message: "Se requieren todos los campos: projectType, materials, size" 
        });
      }
      
      log(`Estimando costos para ${projectType}`, "api");
      
      // Llamada a OpenAI para estimar costos
      const estimate = await estimateDesignCost(
        projectType,
        Array.isArray(materials) ? materials : [materials],
        size
      );
      
      res.json(estimate);
    } catch (error: any) {
      log(`Error estimando costos: ${error.message}`, "api");
      res.status(500).json({ message: `Error estimando costos: ${error.message}` });
    }
  });
  
  // Nuevos endpoints para generador de diseño con Gemini
  
  // Endpoint para chat con asistente de diseño
  app.post("/api/design-chat", async (req, res) => {
    try {
      const { message, projectType } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          message: "Se requiere un mensaje para el chat" 
        });
      }
      
      log(`Chat con asistente. Mensaje: ${message.substring(0, 50)}...`, "gemini-api");
      
      // Llamada a Gemini para procesar el chat
      const response = await chatWithAssistant(
        message, 
        projectType || 'general'
      );
      
      res.json(response);
    } catch (error: any) {
      log(`Error en chat con asistente: ${error.message}`, "gemini-api");
      res.status(500).json({ message: `Error en chat con asistente: ${error.message}` });
    }
  });
  
  // Endpoint para generar diseño personalizado
  app.post("/api/design-generator", async (req, res) => {
    try {
      const { tipo, material, color, estilo, medidas, extra } = req.body;
      
      if (!tipo || !material || !color || !estilo || !medidas) {
        return res.status(400).json({ 
          message: "Se requieren todos los campos: tipo, material, color, estilo, medidas" 
        });
      }
      
      log(`Generando diseño tipo: ${tipo}, estilo: ${estilo}`, "gemini-api");
      
      // Llamada a Gemini para generar diseño
      const designResult = await generateDesignWithGemini({
        tipo,
        material,
        color,
        estilo,
        medidas,
        extra
      });
      
      res.json(designResult);
    } catch (error: any) {
      log(`Error generando diseño: ${error.message}`, "gemini-api");
      res.status(500).json({ message: `Error generando diseño: ${error.message}` });
    }
  });
  
  // Endpoint para analizar imagen con Gemini
  app.post("/api/analyze-image-gemini", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      const projectType = req.body.projectType || "cocina";
      const imageBase64 = req.file.buffer.toString("base64");
      
      log(`Analizando imagen con Gemini para: ${projectType}`, "gemini-api");
      
      // Llamada a Gemini para analizar la imagen
      const analysis = await analyzeImageWithGemini(imageBase64, projectType);
      
      res.json(analysis);
    } catch (error: any) {
      log(`Error analizando imagen: ${error.message}`, "gemini-api");
      res.status(500).json({ message: `Error analizando imagen: ${error.message}` });
    }
  });
  
  // Endpoint para obtener sugerencias de diseño
  app.post("/api/design-suggestions", async (req, res) => {
    try {
      const { projectType, style, materials } = req.body;
      
      if (!projectType || !style || !materials) {
        return res.status(400).json({ 
          message: "Se requieren todos los campos: projectType, style, materials" 
        });
      }
      
      log(`Generando sugerencias para: ${projectType}, estilo: ${style}`, "gemini-api");
      
      // Llamada a Gemini para obtener sugerencias
      const suggestions = await getDesignSuggestions(
        projectType,
        style,
        Array.isArray(materials) ? materials : [materials]
      );
      
      res.json(suggestions);
    } catch (error: any) {
      log(`Error generando sugerencias: ${error.message}`, "gemini-api");
      res.status(500).json({ message: `Error generando sugerencias: ${error.message}` });
    }
  });
  
  // Material routes
  app.get("/api/materials", async (req, res) => {
    try {
      const materials = await storage.getMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });
  
  app.get("/api/materials/type/:type", async (req, res) => {
    try {
      const materials = await storage.getMaterialsByType(req.params.type);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch materials by type" });
    }
  });
  
  // Distributor routes
  app.get("/api/distributors", async (req, res) => {
    try {
      const distributors = await storage.getDistributors();
      res.json(distributors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distributors" });
    }
  });
  
  app.get("/api/distributors/:id", async (req, res) => {
    try {
      const distributor = await storage.getDistributor(parseInt(req.params.id));
      if (!distributor) {
        return res.status(404).json({ message: "Distributor not found" });
      }
      res.json(distributor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distributor" });
    }
  });
  
  // Contact/Message routes
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Quote routes
  app.post("/api/quotes", requireAuth, async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      
      const quote = await storage.createQuote(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quote" });
    }
  });
  
  app.get("/api/quotes", requireAuth, async (req, res) => {
    try {
      const quotes = await storage.getQuotesByUser(req.session.userId);
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });
  
  // HEIC conversion endpoint
  app.post("/api/convert-heic", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      log("Converting HEIC image", "server");
      
      try {
        // Convert HEIC to JPEG using heic-convert
        const jpegBuffer = await heicConvert({
          buffer: req.file.buffer,
          format: 'JPEG',
          quality: 0.85
        });
        
        // Set the appropriate headers
        res.set('Content-Type', 'image/jpeg');
        res.set('Content-Disposition', 'inline');
        
        // Send the converted image
        res.send(jpegBuffer);
      } catch (conversionError) {
        console.error("HEIC conversion error:", conversionError);
        return res.status(500).json({ message: "Failed to convert HEIC image" });
      }
    } catch (error) {
      console.error("Error in HEIC conversion route:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
