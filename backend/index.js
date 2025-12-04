import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  serviceApplicationTemplate,
  contactFormTemplate,
} from "./emailTemplates.js";
import { connectDB, isDBConnected } from "./config/db.js";
import Vacancy from "./models/Vacancy.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend directory
const envPath = join(__dirname, ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn("⚠️ Warning: .env file not found or error loading it:", result.error.message);
  console.log("📍 Looking for .env at:", envPath);
} else {
  console.log("✅ .env file loaded successfully");
}

// Debug: Check if MONGODB_URI is loaded (without showing the actual value)
if (process.env.MONGODB_URI) {
  const uriPreview = process.env.MONGODB_URI.substring(0, 20) + "...";
  console.log("✅ MONGODB_URI is set:", uriPreview);
} else {
  console.error("❌ MONGODB_URI is NOT set in environment variables");
  console.log("💡 Make sure your .env file contains: MONGODB_URI=your_mongodb_atlas_url");
}

const app = express();

// CORS configuration - allow both localhost and production domain
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://localhost:5174', 
    'http://localhost:5175',
    'https://www.jan-seva.site',
    'https://jan-seva.site',
    'https://etawah-jan-a6ol.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log environment info (for debugging)
app.use((req, res, next) => {
  if (req.path === '/api/health' || req.path.startsWith('/api/vacancies')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  console.error('⚠️ Server will start but database operations may fail.');
  console.error('💡 Make sure MONGODB_URI is set in your environment variables.');
  // Don't exit - let the server start and handle errors gracefully
});

// ✅ CONFIG
const RECIPIENTS = ["dhaniramsingh711@gmail.com", "mohitporwal596@gmail.com"];
const FROM_ADDRESS = "Jun Seva Kendra <onboarding@resend.dev>";
const PORT = process.env.PORT || 5000;

console.log("✅ Server starting...");
console.log("📧 Recipients:", RECIPIENTS.join(", "));

/**
 * ✅ Helper function to send email safely
 */
async function sendEmailSafe({ to, subject, html }) {
  try {
    console.log(`📤 Attempting to send to: ${to}`);

    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });

    // 🧠 FIX: Support both response shapes
    const messageId = response?.id || response?.data?.id;

    console.log("📦 Raw response:", response);

    if (!messageId) {
      throw new Error("No response ID returned from Resend");
    }

    console.log(`✅ Email sent to ${to} (ID: ${messageId})`);
    return { success: true, id: messageId };
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * ✅ Helper function to validate fields
 */
function validateFields(obj, requiredFields) {
  for (const field of requiredFields) {
    if (!obj[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

/**
 * 🧾 Service Application Form
 */
app.post("/apply-service", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile: phone,
      service_type: service,
      address,
    } = req.body;

    const errorMsg = validateFields(req.body, [
      "name",
      "mobile",
      "service_type",
      "address",
    ]);
    if (errorMsg) return res.status(400).json({ error: errorMsg });

    console.log("\n🔥 NEW SERVICE APPLICATION 🔥");
    console.log({ name, email, phone, service, address });

    const subject = `🔔 New Service Application - ${service}`;
    const html = serviceApplicationTemplate({
      name,
      email,
      phone,
      service,
      address,
    });

    // Send emails sequentially
    const results = [];
    for (const to of RECIPIENTS) {
      const result = await sendEmailSafe({ to, subject, html });
      results.push({ to, ...result });
      await new Promise((r) => setTimeout(r, 1000)); // wait 1s between sends
    }

    const successCount = results.filter((r) => r.success).length;

    if (successCount > 0) {
      return res.json({
        message: "✅ Application submitted successfully",
        results,
      });
    } else {
      return res.status(500).json({
        error: "❌ All email deliveries failed",
        results,
      });
    }
  } catch (err) {
    console.error("💥 SERVER ERROR (apply-service):", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

/**
 * 💬 Contact Form
 */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const errorMsg = validateFields(req.body, ["name", "email", "message"]);
    if (errorMsg) return res.status(400).json({ error: errorMsg });

    console.log("\n💬 NEW CONTACT MESSAGE 💬");
    console.log({ name, email, message });

    const subject = `💬 New Contact Message from ${name}`;
    const html = contactFormTemplate({ name, email, message });

    // Send to both recipients
    const results = [];
    for (const to of RECIPIENTS) {
      const result = await sendEmailSafe({ to, subject, html });
      results.push({ to, ...result });
      await new Promise((r) => setTimeout(r, 1000));
    }

    const successCount = results.filter((r) => r.success).length;

    if (successCount > 0) {
      return res.json({
        message: "✅ Message sent successfully",
        results,
      });
    } else {
      return res.status(500).json({
        error: "❌ All email deliveries failed",
        results,
      });
    }
  } catch (err) {
    console.error("💥 SERVER ERROR (contact):", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

/**
 * 📋 Health Check Endpoint
 */
app.get("/api/health", async (req, res) => {
  const dbStatus = isDBConnected() ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

/**
 * 📋 Vacancies API Endpoints
 */

// Get all vacancies
app.get("/api/vacancies", async (req, res) => {
  try {
    // Check database connection
    if (!isDBConnected()) {
      console.log("⚠️ DB not connected, attempting to reconnect...");
      try {
        await connectDB();
      } catch (connError) {
        console.error("❌ Reconnection failed:", connError.message);
        console.error("Connection error details:", {
          name: connError.name,
          code: connError.code,
          message: connError.message
        });
        return res.status(503).json({ 
          error: "Database not available",
          message: "MongoDB connection failed. Please check MONGODB_URI environment variable.",
          hint: "Make sure MONGODB_URI is set correctly in your .env file"
        });
      }
      
      // Double check after reconnection
      if (!isDBConnected()) {
        return res.status(503).json({ 
          error: "Database not available",
          message: "MongoDB connection could not be established",
          hint: "Check your MongoDB Atlas connection string"
        });
      }
    }
    
    // Try to fetch vacancies
    try {
      const vacancies = await Vacancy.find().sort({ createdAt: -1 });
      console.log(`✅ Fetched ${vacancies.length} vacancies`);
      return res.json(vacancies || []);
    } catch (queryError) {
      console.error("❌ Error querying vacancies:", queryError);
      
      // Check if it's a MongoDB connection error
      if (queryError.name === 'MongoServerError' || 
          queryError.name === 'MongoError' ||
          queryError.message.includes('connection') ||
          queryError.message.includes('timeout')) {
        return res.status(503).json({ 
          error: "Database connection error",
          message: "Failed to query database. Please check MongoDB connection.",
          hint: "Verify MONGODB_URI is correct in your .env file"
        });
      }
      
      // Other database errors
      throw queryError;
    }
  } catch (error) {
    console.error("❌ Error fetching vacancies:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return appropriate status code based on error type
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      return res.status(503).json({ 
        error: "Database error",
        message: "Failed to fetch vacancies from database",
        hint: "Check MongoDB connection and environment variables"
      });
    }
    
    // Generic error
    res.status(500).json({ 
      error: "Failed to fetch vacancies",
      message: "An unexpected error occurred",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new vacancy
app.post("/api/vacancies", async (req, res) => {
  try {
    // Check database connection and reconnect if needed
    if (!isDBConnected()) {
      console.log("⚠️ DB not connected, attempting to reconnect...");
      try {
        await connectDB();
      } catch (connError) {
        console.error("❌ Reconnection failed:", connError.message);
        console.error("Connection error details:", {
          name: connError.name,
          code: connError.code,
          message: connError.message
        });
        
        // Provide helpful error message
        let hintMessage = "Make sure MONGODB_URI is set correctly with your MongoDB Atlas URL";
        if (process.env.VERCEL) {
          hintMessage = "For Vercel: Go to Dashboard → Settings → Environment Variables → Add MONGODB_URI → Redeploy";
        }
        
        return res.status(503).json({ 
          error: "Database connection failed",
          message: "MongoDB connection could not be established. Please check MONGODB_URI environment variable.",
          hint: hintMessage,
          details: process.env.NODE_ENV === 'development' ? connError.message : undefined
        });
      }
      
      // Double check after reconnection attempt
      if (!isDBConnected()) {
        let hintMessage = "Verify your MongoDB Atlas connection string is correct";
        if (process.env.VERCEL) {
          hintMessage = "For Vercel: Check Environment Variables → MONGODB_URI → Redeploy";
        }
        
        return res.status(503).json({ 
          error: "Database not available",
          message: "MongoDB connection could not be established. Please check MONGODB_URI environment variable.",
          hint: hintMessage
        });
      }
    }

    const { title, tag, info, date, lastDate, vacancies, link } = req.body;
    
    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!tag || !tag.trim()) {
      return res.status(400).json({ error: "Tag is required" });
    }

    console.log("📝 Creating vacancy:", { title, tag, info, date, lastDate, vacancies, link });

    const vacancy = new Vacancy({
      title: title.trim(),
      tag: tag.trim(),
      info: info ? info.trim() : '',
      date: date ? date.trim() : '',
      lastDate: lastDate ? lastDate.trim() : '',
      vacancies: vacancies ? (Number(vacancies) || null) : null,
      link: link ? link.trim() : '',
    });

    // Validate before saving
    const validationError = vacancy.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation error",
        details: errors.join(', ')
      });
    }

    const savedVacancy = await vacancy.save();
    console.log("✅ Vacancy created successfully:", savedVacancy._id);
    console.log("📊 Saved vacancy:", JSON.stringify(savedVacancy.toObject(), null, 2));
    
    res.status(201).json({
      ...savedVacancy.toObject(),
      id: savedVacancy._id.toString()
    });
  } catch (error) {
    console.error("❌ Error creating vacancy:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation error",
        details: errors.join(', ')
      });
    }
    
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      console.error("MongoDB Error Code:", error.code);
      // Check if it's a connection error
      if (error.message.includes('connection') || error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
        return res.status(503).json({ 
          error: "Database connection error",
          message: "Failed to connect to MongoDB. Please check MONGODB_URI in your .env file.",
          hint: "Make sure MongoDB is running and MONGODB_URI is correct"
        });
      }
      return res.status(500).json({ 
        error: "Database error",
        message: "Failed to save vacancy to database",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Check for connection errors
    if (error.message && (error.message.includes('connection') || error.message.includes('ECONNREFUSED') || error.message.includes('timeout'))) {
      return res.status(503).json({ 
        error: "Database connection error",
        message: "Failed to connect to MongoDB. Please check MONGODB_URI in your .env file.",
        hint: "Make sure MongoDB is running and MONGODB_URI is correct"
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: "Invalid data type",
        details: error.message
      });
    }

    // Generic error
    res.status(500).json({ 
      error: "Failed to create vacancy",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update vacancy
app.put("/api/vacancies/:id", async (req, res) => {
  try {
    if (!isDBConnected()) {
      console.log("⚠️ DB not connected, attempting to reconnect...");
      try {
        await connectDB();
      } catch (connError) {
        console.error("❌ Reconnection failed:", connError.message);
        return res.status(503).json({ 
          error: "Database not available",
          message: "Please check MongoDB connection string in environment variables"
        });
      }
      
      if (!isDBConnected()) {
        return res.status(503).json({ 
          error: "Database not available",
          message: "MongoDB connection could not be established"
        });
      }
    }

    const { id } = req.params;
    const { title, tag, info, date, lastDate, vacancies, link } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Vacancy ID is required" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (tag !== undefined) updateData.tag = tag.trim();
    if (info !== undefined) updateData.info = info ? info.trim() : '';
    if (date !== undefined) updateData.date = date ? date.trim() : '';
    if (lastDate !== undefined) updateData.lastDate = lastDate ? lastDate.trim() : '';
    if (vacancies !== undefined) updateData.vacancies = vacancies ? (Number(vacancies) || null) : null;
    if (link !== undefined) updateData.link = link ? link.trim() : '';

    console.log("📝 Updating vacancy:", id, updateData);

    const vacancy = await Vacancy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    console.log("✅ Vacancy updated successfully:", vacancy._id);
    res.json(vacancy);
  } catch (error) {
    console.error("❌ Error updating vacancy:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Validation error",
        details: errors.join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: "Invalid vacancy ID format"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to update vacancy",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete vacancy
app.delete("/api/vacancies/:id", async (req, res) => {
  try {
    if (!isDBConnected()) {
      console.log("⚠️ DB not connected, attempting to reconnect...");
      try {
        await connectDB();
      } catch (connError) {
        console.error("❌ Reconnection failed:", connError.message);
        return res.status(503).json({ 
          error: "Database not available",
          message: "Please check MongoDB connection string in environment variables"
        });
      }
      
      if (!isDBConnected()) {
        return res.status(503).json({ 
          error: "Database not available",
          message: "MongoDB connection could not be established"
        });
      }
    }

    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "Vacancy ID is required" });
    }

    console.log("🗑️ Deleting vacancy:", id);
    const vacancy = await Vacancy.findByIdAndDelete(id);

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    console.log("✅ Vacancy deleted successfully:", id);
    res.json({ message: "Vacancy deleted successfully", id });
  } catch (error) {
    console.error("❌ Error deleting vacancy:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: "Invalid vacancy ID format"
      });
    }
    
    res.status(500).json({ 
      error: "Failed to delete vacancy",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Start server (for local development)
// For Vercel, the app is exported as a serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log("📧 Sending emails to:", RECIPIENTS.join(", "));
    console.log("✅ Ready to receive form submissions!\n");
  });
}

// Export for Vercel serverless functions (for production deployment)
export default app;
