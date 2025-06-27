import { pgTable, text, serial, integer, boolean, timestamp, uuid, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Auth users table (simplified version of Supabase auth)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password"),
  email_confirmed_at: timestamp("email_confirmed_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// User profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().references(() => users.id),
  email: text("email"),
  full_name: text("full_name"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// User credits
export const user_credits = pgTable("user_credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  balance: integer("balance").default(0),
  total_spent: integer("total_spent").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Widgets
export const widgets = pgTable("widgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  website_url: text("website_url").notNull(),
  button_color: text("button_color").default("#25d366"),
  position: text("position").default("right"),
  tooltip: text("tooltip"),
  tooltip_display: text("tooltip_display").default("hover"),
  tooltip_position: text("tooltip_position").default("top"),
  greeting_message: text("greeting_message"),
  video_enabled: boolean("video_enabled").default(false),
  video_url: text("video_url"),
  video_height: integer("video_height").default(200),
  video_alignment: text("video_alignment").default("center"),
  button_style: text("button_style"),
  custom_icon_url: text("custom_icon_url"),
  button_size: integer("button_size").default(60),
  preview_video_height: integer("preview_video_height").default(120),
  show_on_mobile: boolean("show_on_mobile").default(true),
  show_on_desktop: boolean("show_on_desktop").default(true),
  template_id: text("template_id").default("default"),
  channels: jsonb("channels"),
  total_views: integer("total_views").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Widget views (for analytics)
export const widget_views = pgTable("widget_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  widget_id: uuid("widget_id").notNull().references(() => widgets.id),
  user_id: uuid("user_id").notNull().references(() => users.id),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  credits_used: integer("credits_used").default(1),
  view_date: timestamp("view_date").defaultNow(),
});

// Transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  transaction_id: text("transaction_id").notNull().unique(),
  email: text("email").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").default("completed"),
  product_id: text("product_id"),
  credits_added: integer("credits_added").notNull(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Support tickets
export const support_tickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open"),
  priority: text("priority").default("medium"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Ticket replies
export const ticket_replies = pgTable("ticket_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticket_id: uuid("ticket_id").notNull().references(() => support_tickets.id),
  user_id: uuid("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  is_admin: boolean("is_admin").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Blogs
export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featured_image: text("featured_image"),
  status: text("status").default("published"),
  author_id: uuid("author_id").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// FAQs
export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  sort_order: integer("sort_order").default(0),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  created_at: true,
  updated_at: true,
});

export const insertWidgetSchema = createInsertSchema(widgets).omit({
  id: true,
  created_at: true,
  updated_at: true,
  total_views: true,
});

export const insertUserCreditsSchema = createInsertSchema(user_credits).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertSupportTicketSchema = createInsertSchema(support_tickets).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTicketReplySchema = createInsertSchema(ticket_replies).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Widget = typeof widgets.$inferSelect;
export type InsertWidget = z.infer<typeof insertWidgetSchema>;
export type UserCredits = typeof user_credits.$inferSelect;
export type InsertUserCredits = z.infer<typeof insertUserCreditsSchema>;
export type SupportTicket = typeof support_tickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type TicketReply = typeof ticket_replies.$inferSelect;
export type InsertTicketReply = z.infer<typeof insertTicketReplySchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;
