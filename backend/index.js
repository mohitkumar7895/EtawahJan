import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";
import {
  serviceApplicationTemplate,
  contactFormTemplate,
} from "./emailTemplates.js";
import { connectDB, isDBConnected } from "./config/db.js";
import Vacancy from "./models/Vacancy.js";

dotenv.config();

const app = express();
app.use(cors());
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
  console.error('Failed to connect to MongoDB:', err);
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
    if (!isDBConnected()) {
      // Try to reconnect
      await connectDB();
      if (!isDBConnected()) {
        return res.status(503).json({ error: "Database not available. Please try again later." });
      }
    }
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    res.status(500).json({ 
      error: "Failed to fetch vacancies",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new vacancy
app.post("/api/vacancies", async (req, res) => {
  try {
    // Check database connection
    if (!isDBConnected()) {
      console.log("⚠️ DB not connected, attempting to reconnect...");
      try {
        await connectDB();
      } catch (connError) {
        console.error("❌ Reconnection failed:", connError);
        return res.status(503).json({ 
          error: "Database connection failed",
          message: "Please check MongoDB connection string in environment variables"
        });
      }
      
      if (!isDBConnected()) {
        return res.status(503).json({ 
          error: "Database not available",
          message: "MongoDB connection could not be established. Please check MONGODB_URI environment variable."
        });
      }
    }

    const { title, tag, info, date, lastDate, vacancies, link } = req.body;
    
    if (!title || !tag) {
      return res.status(400).json({ error: "Title and tag are required" });
    }

    console.log("📝 Creating vacancy:", { title, tag });

    const vacancy = new Vacancy({
      title: title.trim(),
      tag: tag.trim(),
      info: info ? info.trim() : '',
      date: date ? date.trim() : '',
      lastDate: lastDate ? lastDate.trim() : '',
      vacancies: vacancies ? Number(vacancies) : null,
      link: link ? link.trim() : '',
    });

    const savedVacancy = await vacancy.save();
    console.log("✅ Vacancy created successfully:", savedVacancy._id);
    
    res.status(201).json({
      ...savedVacancy.toObject(),
      id: savedVacancy._id.toString()
    });
  } catch (error) {
    console.error("❌ Error creating vacancy:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    
    // More detailed error response
    let errorMessage = "Failed to create vacancy";
    let errorDetails = null;

    if (error.name === 'ValidationError') {
      errorMessage = "Validation error";
      errorDetails = Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.name === 'MongoServerError') {
      errorMessage = "Database error";
      errorDetails = error.message;
    } else if (error.message) {
      errorDetails = error.message;
    }

    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails || (process.env.NODE_ENV === 'development' ? error.stack : undefined)
    });
  }
});

// Update vacancy
app.put("/api/vacancies/:id", async (req, res) => {
  try {
    if (!isDBConnected()) {
      await connectDB();
      if (!isDBConnected()) {
        return res.status(503).json({ error: "Database not available. Please try again later." });
      }
    }

    const { id } = req.params;
    const { title, tag, info, date, lastDate, vacancies, link } = req.body;

    const vacancy = await Vacancy.findByIdAndUpdate(
      id,
      {
        title,
        tag,
        info: info || '',
        date: date || '',
        lastDate: lastDate || '',
        vacancies: vacancies ? Number(vacancies) : null,
        link: link || '',
      },
      { new: true, runValidators: true }
    );

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    res.json(vacancy);
  } catch (error) {
    console.error("Error updating vacancy:", error);
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
      await connectDB();
      if (!isDBConnected()) {
        return res.status(503).json({ error: "Database not available. Please try again later." });
      }
    }

    const { id } = req.params;
    const vacancy = await Vacancy.findByIdAndDelete(id);

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    res.json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    console.error("Error deleting vacancy:", error);
    res.status(500).json({ 
      error: "Failed to delete vacancy",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log("📧 Sending emails to:", RECIPIENTS.join(", "));
  console.log("✅ Ready to receive form submissions!\n");
});
