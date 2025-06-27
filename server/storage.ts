import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  profiles, 
  widgets, 
  user_credits, 
  support_tickets,
  ticket_replies,
  transactions,
  blogs,
  faqs,
  widget_views,
  type User, 
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Widget,
  type InsertWidget,
  type UserCredits,
  type InsertUserCredits,
  type SupportTicket,
  type InsertSupportTicket,
  type TicketReply,
  type InsertTicketReply,
  type Transaction,
  type InsertTransaction,
  type Blog,
  type InsertBlog,
  type FAQ,
  type InsertFAQ
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Profile management
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  // Widget management
  getWidget(id: string): Promise<Widget | undefined>;
  getWidgetsByUser(userId: string): Promise<Widget[]>;
  createWidget(widget: InsertWidget): Promise<Widget>;
  updateWidget(id: string, updates: Partial<Widget>): Promise<Widget | undefined>;
  deleteWidget(id: string): Promise<boolean>;
  
  // User credits
  getUserCredits(userId: string): Promise<UserCredits | undefined>;
  createUserCredits(credits: InsertUserCredits): Promise<UserCredits>;
  updateUserCredits(userId: string, updates: Partial<UserCredits>): Promise<UserCredits | undefined>;
  
  // Support tickets
  getSupportTickets(userId: string): Promise<SupportTicket[]>;
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined>;
  
  // Ticket replies
  getTicketReplies(ticketId: string): Promise<TicketReply[]>;
  createTicketReply(reply: InsertTicketReply): Promise<TicketReply>;
  
  // Transactions
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionByTxId(transactionId: string): Promise<Transaction | undefined>;
  
  // Content
  getBlogs(): Promise<Blog[]>;
  getBlog(slug: string): Promise<Blog | undefined>;
  getFAQs(): Promise<FAQ[]>;
  
  // Analytics
  recordWidgetView(widgetId: string, userId: string, ipAddress?: string, userAgent?: string): Promise<boolean>;
  getWidgetViews(widgetId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set(updates).where(eq(profiles.id, userId)).returning();
    return result[0];
  }

  // Widget management
  async getWidget(id: string): Promise<Widget | undefined> {
    const result = await db.select().from(widgets).where(eq(widgets.id, id)).limit(1);
    return result[0];
  }

  async getWidgetsByUser(userId: string): Promise<Widget[]> {
    return await db.select().from(widgets).where(eq(widgets.user_id, userId));
  }

  async createWidget(widget: InsertWidget): Promise<Widget> {
    const result = await db.insert(widgets).values(widget).returning();
    return result[0];
  }

  async updateWidget(id: string, updates: Partial<Widget>): Promise<Widget | undefined> {
    const result = await db.update(widgets).set({
      ...updates,
      updated_at: new Date()
    }).where(eq(widgets.id, id)).returning();
    return result[0];
  }

  async deleteWidget(id: string): Promise<boolean> {
    const result = await db.delete(widgets).where(eq(widgets.id, id)).returning();
    return result.length > 0;
  }

  // User credits
  async getUserCredits(userId: string): Promise<UserCredits | undefined> {
    const result = await db.select().from(user_credits).where(eq(user_credits.user_id, userId)).limit(1);
    return result[0];
  }

  async createUserCredits(credits: InsertUserCredits): Promise<UserCredits> {
    const result = await db.insert(user_credits).values(credits).returning();
    return result[0];
  }

  async updateUserCredits(userId: string, updates: Partial<UserCredits>): Promise<UserCredits | undefined> {
    const result = await db.update(user_credits).set({
      ...updates,
      updated_at: new Date()
    }).where(eq(user_credits.user_id, userId)).returning();
    return result[0];
  }

  // Support tickets
  async getSupportTickets(userId: string): Promise<SupportTicket[]> {
    return await db.select().from(support_tickets).where(eq(support_tickets.user_id, userId));
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const result = await db.select().from(support_tickets).where(eq(support_tickets.id, id)).limit(1);
    return result[0];
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const result = await db.insert(support_tickets).values(ticket).returning();
    return result[0];
  }

  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    const result = await db.update(support_tickets).set({
      ...updates,
      updated_at: new Date()
    }).where(eq(support_tickets.id, id)).returning();
    return result[0];
  }

  // Ticket replies
  async getTicketReplies(ticketId: string): Promise<TicketReply[]> {
    return await db.select().from(ticket_replies).where(eq(ticket_replies.ticket_id, ticketId));
  }

  async createTicketReply(reply: InsertTicketReply): Promise<TicketReply> {
    const result = await db.insert(ticket_replies).values(reply).returning();
    return result[0];
  }

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.user_id, userId));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async getTransactionByTxId(transactionId: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.transaction_id, transactionId)).limit(1);
    return result[0];
  }

  // Content
  async getBlogs(): Promise<Blog[]> {
    return await db.select().from(blogs).where(eq(blogs.status, "published"));
  }

  async getBlog(slug: string): Promise<Blog | undefined> {
    const result = await db.select().from(blogs).where(
      and(eq(blogs.slug, slug), eq(blogs.status, "published"))
    ).limit(1);
    return result[0];
  }

  async getFAQs(): Promise<FAQ[]> {
    return await db.select().from(faqs).where(eq(faqs.is_active, true));
  }

  // Analytics
  async recordWidgetView(widgetId: string, userId: string, ipAddress?: string, userAgent?: string): Promise<boolean> {
    try {
      await db.insert(widget_views).values({
        widget_id: widgetId,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        credits_used: 1
      });
      
      // Update widget total views
      const currentWidget = await db.select().from(widgets).where(eq(widgets.id, widgetId)).limit(1);
      if (currentWidget[0]) {
        await db.update(widgets).set({
          total_views: (currentWidget[0].total_views || 0) + 1
        }).where(eq(widgets.id, widgetId));
      }
      
      return true;
    } catch (error) {
      console.error("Error recording widget view:", error);
      return false;
    }
  }

  async getWidgetViews(widgetId: string): Promise<number> {
    const result = await db.select().from(widgets).where(eq(widgets.id, widgetId)).limit(1);
    return result[0]?.total_views || 0;
  }
}

export const storage = new DatabaseStorage();
