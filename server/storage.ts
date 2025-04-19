import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  materials, type Material, type InsertMaterial,
  distributors, type Distributor, type InsertDistributor,
  messages, type Message, type InsertMessage,
  quotes, type Quote, type InsertQuote
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, info: {id: string, subscriptionId: string}): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProjectsByUser(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<boolean>;
  
  // Material methods
  getMaterials(): Promise<Material[]>;
  getMaterialsByType(type: string): Promise<Material[]>;
  getMaterial(id: number): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  
  // Distributor methods
  getDistributors(): Promise<Distributor[]>;
  getDistributor(id: number): Promise<Distributor | undefined>;
  createDistributor(distributor: InsertDistributor): Promise<Distributor>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  
  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuotesByUser(userId: number): Promise<Quote[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private materials: Map<number, Material>;
  private distributors: Map<number, Distributor>;
  private messages: Map<number, Message>;
  private quotes: Map<number, Quote>;
  
  private currentUserId: number;
  private currentProjectId: number;
  private currentMaterialId: number;
  private currentDistributorId: number;
  private currentMessageId: number;
  private currentQuoteId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.materials = new Map();
    this.distributors = new Map();
    this.messages = new Map();
    this.quotes = new Map();
    
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentMaterialId = 1;
    this.currentDistributorId = 1;
    this.currentMessageId = 1;
    this.currentQuoteId = 1;
    
    // Add sample materials
    this.seedMaterials();
    
    // Add sample distributors
    this.seedDistributors();
  }

  // Seed initial data
  private seedMaterials() {
    const sampleMaterials: InsertMaterial[] = [
      {
        name: "Laminado blanco mate",
        category: "Cocina",
        type: "Acabado",
        color: "Blanco",
        finish: "Mate",
        unit: "m²",
        price: 4500,
        availability: "available",
        distributorId: 1,
        imageUrl: ""
      },
      {
        name: "Cuarzo blanco",
        category: "Cocina",
        type: "Encimera",
        color: "Blanco",
        finish: "Pulido",
        unit: "m²",
        price: 12000,
        availability: "limited",
        distributorId: 2,
        imageUrl: ""
      },
      {
        name: "Tiradores acero inoxidable",
        category: "Cocina",
        type: "Hardware",
        color: "Plateado",
        finish: "Cepillado",
        unit: "unidad",
        price: 1500,
        availability: "available",
        distributorId: 3,
        imageUrl: ""
      }
    ];
    
    sampleMaterials.forEach(material => this.createMaterial(material));
  }
  
  private seedDistributors() {
    const sampleDistributors: InsertDistributor[] = [
      {
        name: "Maderas del Caribe",
        location: "San Juan, PR",
        description: "Especialistas en maderas nativas y tratadas para ambientes costeros.",
        status: "available",
        imageUrl: "https://images.unsplash.com/photo-1577538928305-3807c3993047",
        contactInfo: { phone: "(787) 555-1234", email: "info@maderascaribe.com" }
      },
      {
        name: "Isla Surfaces",
        location: "Ponce, PR",
        description: "Superficies de cuarzo, granito y materiales ultracompactos para encimeras.",
        status: "available",
        imageUrl: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a",
        contactInfo: { phone: "(787) 555-5678", email: "ventas@islasurfaces.com" }
      },
      {
        name: "Herrajes Modernos",
        location: "Mayagüez, PR",
        description: "Tiradores, bisagras y sistemas de organización para espacios modernos.",
        status: "limited",
        imageUrl: "https://images.unsplash.com/photo-1581235707860-23c8a22437d7",
        contactInfo: { phone: "(787) 555-9012", email: "contacto@herrajesmodernos.com" }
      }
    ];
    
    sampleDistributors.forEach(distributor => this.createDistributor(distributor));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, stripeCustomerId: customerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserStripeInfo(userId: number, info: {id: string, subscriptionId: string}): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: info.id, 
      stripeSubscriptionId: info.subscriptionId 
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProjectsByUser(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    );
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      cost: null,
      estimatedDeliveryTime: null,
      aiAnalysis: null,
      materialsList: null,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const project = await this.getProject(id);
    if (!project) throw new Error("Project not found");
    
    const now = new Date();
    const updatedProject = { ...project, ...updates, updatedAt: now };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Material methods
  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }
  
  async getMaterialsByType(type: string): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(
      (material) => material.type === type
    );
  }
  
  async getMaterial(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }
  
  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.currentMaterialId++;
    const material: Material = { ...insertMaterial, id };
    this.materials.set(id, material);
    return material;
  }
  
  // Distributor methods
  async getDistributors(): Promise<Distributor[]> {
    return Array.from(this.distributors.values());
  }
  
  async getDistributor(id: number): Promise<Distributor | undefined> {
    return this.distributors.get(id);
  }
  
  async createDistributor(insertDistributor: InsertDistributor): Promise<Distributor> {
    const id = this.currentDistributorId++;
    const distributor: Distributor = { ...insertDistributor, id };
    this.distributors.set(id, distributor);
    return distributor;
  }
  
  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: now,
      isRead: false
    };
    this.messages.set(id, message);
    return message;
  }
  
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }
  
  // Quote methods
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.currentQuoteId++;
    const now = new Date();
    const quote: Quote = { 
      ...insertQuote, 
      id, 
      createdAt: now
    };
    this.quotes.set(id, quote);
    return quote;
  }
  
  async getQuotesByUser(userId: number): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(
      (quote) => quote.userId === userId
    );
  }
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        role: insertUser.role || 'user',
        fullName: insertUser.fullName || null,
        isProfessional: insertUser.isProfessional || false,
        stripeCustomerId: null,
        stripeSubscriptionId: null
      } as typeof users.$inferInsert)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: number, info: {id: string, subscriptionId: string}): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: info.id,
        stripeSubscriptionId: info.subscriptionId
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async getProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async getProjectsByUser(userId: number): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({
        ...insertProject,
        createdAt: new Date(),
        updatedAt: new Date(),
        cost: null,
        estimatedDeliveryTime: null,
        aiAnalysis: null,
        materialsList: null,
        status: insertProject.status || 'draft'
      })
      .returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id));
    return true;
  }
  
  async getMaterials(): Promise<Material[]> {
    return db.select().from(materials);
  }

  async getMaterialsByType(type: string): Promise<Material[]> {
    return db.select().from(materials).where(eq(materials.type, type));
  }

  async getMaterial(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material || undefined;
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const [material] = await db
      .insert(materials)
      .values(insertMaterial)
      .returning();
    return material;
  }
  
  async getDistributors(): Promise<Distributor[]> {
    return db.select().from(distributors);
  }

  async getDistributor(id: number): Promise<Distributor | undefined> {
    const [distributor] = await db.select().from(distributors).where(eq(distributors.id, id));
    return distributor || undefined;
  }

  async createDistributor(insertDistributor: InsertDistributor): Promise<Distributor> {
    const [distributor] = await db
      .insert(distributors)
      .values(insertDistributor)
      .returning();
    return distributor;
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({
        ...insertMessage,
        createdAt: new Date(),
        isRead: false
      })
      .returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return db.select().from(messages);
  }
  
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await db
      .insert(quotes)
      .values({
        ...insertQuote,
        createdAt: new Date(),
        status: 'pending'
      })
      .returning();
    return quote;
  }

  async getQuotesByUser(userId: number): Promise<Quote[]> {
    return db.select().from(quotes).where(eq(quotes.userId, userId));
  }
}

// Usando la implementación de base de datos
export const storage = new DatabaseStorage();
