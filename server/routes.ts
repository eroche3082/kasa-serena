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

// Vertex AI/Gemini API integration
async function analyzeImageWithGemini(imageBase64: string, projectType: string) {
  try {
    // In a real implementation, we would call the Gemini API here
    // For now, returning mock analysis data based on project type
    let analysisResult: any = {
      dimensions: {
        width: Math.floor(Math.random() * 300) + 100,
        height: Math.floor(Math.random() * 300) + 100,
        depth: Math.floor(Math.random() * 50) + 20
      },
      materialRecommendations: [],
      designSuggestions: [],
      estimatedCost: Math.floor(Math.random() * 5000) + 2000,
      estimatedTime: "3-4 semanas"
    };
    
    if (projectType === "cocina") {
      analysisResult.materialRecommendations = [
        { name: "Laminado blanco mate", area: "12 m²" },
        { name: "Cuarzo blanco", area: "2 m²" }
      ];
      analysisResult.designSuggestions = [
        "Isla central con espacio de almacenamiento",
        "Iluminación LED bajo gabinetes",
        "Distribución en L para maximizar espacio"
      ];
    } else if (projectType === "puerta") {
      analysisResult.materialRecommendations = [
        { name: "Madera de caoba", area: "2.2 m²" },
        { name: "Bisagras de acero inoxidable", quantity: 3 }
      ];
      analysisResult.designSuggestions = [
        "Diseño con paneles para mayor durabilidad",
        "Tratamiento resistente a la humedad",
        "Cerradura de seguridad reforzada"
      ];
    }
    
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Failed to analyze image");
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
  
  // Image analysis route
  app.post("/api/analyze-image", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      const projectType = req.body.projectType || "cocina";
      const imageBase64 = req.file.buffer.toString("base64");
      
      // Call Gemini API to analyze the image
      const analysis = await analyzeImageWithGemini(imageBase64, projectType);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error in image analysis:", error);
      res.status(500).json({ message: "Failed to analyze image" });
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
