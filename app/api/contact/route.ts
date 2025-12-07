import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormTemplate } from '@/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);
const RECIPIENTS = process.env.RECIPIENT_EMAILS 
  ? process.env.RECIPIENT_EMAILS.split(',').map(email => email.trim())
  : ["dhaniramsingh711@gmail.com", "mohitporwal596@gmail.com"];
const FROM_ADDRESS = process.env.FROM_EMAIL || "Jun Seva Kendra <onboarding@resend.dev>";

async function sendEmailSafe({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    console.log(`📤 Attempting to send to: ${to}`);

    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });

    const messageId = (response as any)?.id || (response as any)?.data?.id;

    if (!messageId) {
      throw new Error("No response ID returned from Resend");
    }

    console.log(`✅ Email sent to ${to} (ID: ${messageId})`);
    return { success: true, id: messageId };
  } catch (err: any) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    return { success: false, error: err.message };
  }
}

function validateFields(obj: any, requiredFields: string[]) {
  for (const field of requiredFields) {
    if (!obj[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    const errorMsg = validateFields(body, ["name", "email", "message"]);
    if (errorMsg) {
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

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
      return NextResponse.json({
        message: "✅ Message sent successfully",
        results,
      });
    } else {
      return NextResponse.json(
        {
          error: "❌ All email deliveries failed",
          results,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("💥 SERVER ERROR (contact):", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

