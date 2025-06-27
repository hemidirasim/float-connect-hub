import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateWidgetScript } from "./widget-templates";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertProfileSchema, insertWidgetSchema, type User } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production";

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user: User;
}

// Middleware for authentication
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, full_name } = req.body;
      
      // Validate input
      const userData = insertUserSchema.parse({ email, password });
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword
      });

      // Create profile
      await storage.createProfile({
        id: user.id,
        email: user.email,
        full_name: full_name || email.split('@')[0]
      });

      // Create initial user credits
      await storage.createUserCredits({
        user_id: user.id,
        balance: 100,
        total_spent: 0
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: { id: user.id, email: user.email },
        token,
        session: { access_token: token }
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: { id: user.id, email: user.email },
        token,
        session: { access_token: token }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", authenticateToken, (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/user", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const profile = await storage.getProfile(authReq.user.id);
      res.json({
        user: {
          id: authReq.user.id,
          email: authReq.user.email,
          user_metadata: profile || {}
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Widget routes
  app.get("/api/widgets", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const widgets = await storage.getWidgetsByUser(authReq.user.id);
      res.json(widgets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch widgets" });
    }
  });

  app.post("/api/widgets", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const widgetData = insertWidgetSchema.parse({
        ...req.body,
        user_id: authReq.user.id
      });
      
      const widget = await storage.createWidget(widgetData);
      res.json(widget);
    } catch (error: any) {
      console.error("Widget creation error:", error);
      res.status(400).json({ error: error.message || "Failed to create widget" });
    }
  });

  app.put("/api/widgets/:id", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const widget = await storage.getWidget(id);
      
      if (!widget || widget.user_id !== authReq.user.id) {
        return res.status(404).json({ error: "Widget not found" });
      }

      const updatedWidget = await storage.updateWidget(id, req.body);
      res.json(updatedWidget);
    } catch (error) {
      res.status(400).json({ error: "Failed to update widget" });
    }
  });

  app.delete("/api/widgets/:id", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const widget = await storage.getWidget(id);
      
      if (!widget || widget.user_id !== authReq.user.id) {
        return res.status(404).json({ error: "Widget not found" });
      }

      await storage.deleteWidget(id);
      res.json({ message: "Widget deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete widget" });
    }
  });

  // Widget generation route (public)
  app.get("/api/widget/:id.js", async (req, res) => {
    try {
      const { id } = req.params;
      const widget = await storage.getWidget(id);
      
      if (!widget || !widget.is_active) {
        return res.status(404).send('console.error("Widget not found or inactive");');
      }

      // Check user credits
      const userCredits = await storage.getUserCredits(widget.user_id);
      const balance = userCredits?.balance ?? 0;
      if (!userCredits || balance <= 0) {
        return res.status(403).send('console.error("Widget unavailable - insufficient credits");');
      }

      // Record widget view and deduct credits
      const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      await storage.recordWidgetView(id, widget.user_id, clientIp as string, userAgent);
      await storage.updateUserCredits(widget.user_id, {
        balance: balance - 1,
        total_spent: (userCredits.total_spent || 0) + 1
      });

      // Generate widget script
      const script = generateWidgetScript(widget);
      
      res.set({
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300'
      });
      res.send(script);
    } catch (error) {
      console.error("Widget generation error:", error);
      res.status(500).send('console.error("Widget generation failed");');
    }
  });

  // User credits routes
  app.get("/api/user-credits", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const credits = await storage.getUserCredits(authReq.user.id);
      if (!credits) {
        // Create default credits if not found
        const newCredits = await storage.createUserCredits({
          user_id: authReq.user.id,
          balance: 100,
          total_spent: 0
        });
        return res.json(newCredits);
      }
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user credits" });
    }
  });

  // Profile routes
  app.get("/api/profiles", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const profile = await storage.getProfile(authReq.user.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profiles", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const updatedProfile = await storage.updateProfile(authReq.user.id, req.body);
      res.json(updatedProfile);
    } catch (error) {
      res.status(400).json({ error: "Failed to update profile" });
    }
  });

  // Support tickets routes
  app.get("/api/support-tickets", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tickets = await storage.getSupportTickets(authReq.user.id);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  app.post("/api/support-tickets", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const ticket = await storage.createSupportTicket({
        ...req.body,
        user_id: authReq.user.id
      });
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: "Failed to create support ticket" });
    }
  });

  app.get("/api/ticket-replies/:ticketId", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { ticketId } = req.params;
      
      // Verify ticket belongs to user
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket || ticket.user_id !== authReq.user.id) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      const replies = await storage.getTicketReplies(ticketId);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket replies" });
    }
  });

  app.post("/api/ticket-replies", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { ticket_id } = req.body;
      
      // Verify ticket belongs to user
      const ticket = await storage.getSupportTicket(ticket_id);
      if (!ticket || ticket.user_id !== authReq.user.id) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      const reply = await storage.createTicketReply({
        ...req.body,
        user_id: authReq.user.id
      });
      res.json(reply);
    } catch (error) {
      res.status(400).json({ error: "Failed to create ticket reply" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", authenticateToken, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const transactions = await storage.getTransactions(authReq.user.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Content routes (public)
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const blog = await storage.getBlog(slug);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      res.json(blog);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog" });
    }
  });

  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getFAQs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
