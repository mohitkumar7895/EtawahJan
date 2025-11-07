import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";
import {
  serviceApplicationTemplate,
  contactFormTemplate,
} from "./emailTemplates.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

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

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log("📧 Sending emails to:", RECIPIENTS.join(", "));
  console.log("✅ Ready to receive form submissions!\n");
});
