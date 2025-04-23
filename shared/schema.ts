import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: text("role").default("cliente"), // cliente | admin | disenador
  createdAt: timestamp("created_at").defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isProfessional: boolean("is_professional").default(false)
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // cocina, puerta, ventana, gabinete
  status: text("status").default("draft"),
  cost: integer("cost"),
  estimatedDeliveryTime: text("estimated_delivery_time"),
  imageUrl: text("image_url"),
  aiAnalysis: json("ai_analysis"),
  materialsList: json("materials_list"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Materials table
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  color: text("color"),
  finish: text("finish"),
  unit: text("unit").notNull(),
  price: integer("price").notNull(),
  availability: text("availability").default("available"),
  distributorId: integer("distributor_id"),
  imageUrl: text("image_url")
});

// Distributors table
export const distributors = pgTable("distributors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  status: text("status").default("available"),
  imageUrl: text("image_url"),
  contactInfo: json("contact_info")
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
  subscribed: boolean("subscribed").default(false)
});

// Quotes table
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  projectId: integer("project_id"),
  status: text("status").default("pending"),
  details: json("details"),
  totalCost: integer("total_cost"),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  isProfessional: true
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  name: true,
  description: true,
  type: true,
  status: true,
  imageUrl: true
});

export const insertMaterialSchema = createInsertSchema(materials).pick({
  name: true,
  category: true,
  type: true,
  color: true,
  finish: true,
  unit: true,
  price: true,
  availability: true,
  distributorId: true,
  imageUrl: true
});

export const insertDistributorSchema = createInsertSchema(distributors).pick({
  name: true,
  location: true,
  description: true,
  status: true,
  imageUrl: true,
  contactInfo: true
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
  subscribed: true
});

export const insertQuoteSchema = createInsertSchema(quotes).pick({
  userId: true,
  projectId: true,
  details: true,
  totalCost: true
});

// Type definitions
export type UserRole = 'admin' | 'cliente' | 'disenador';

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type Distributor = typeof distributors.$inferSelect;
export type InsertDistributor = z.infer<typeof insertDistributorSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
