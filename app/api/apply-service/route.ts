import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { serviceApplicationTemplate } from '@/lib/emailTemplates';

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
    const {
      name,
      email,
      mobile: phone,
      service_type: service,
      address,
    } = body;

    const errorMsg = validateFields(body, [
      "name",
      "mobile",
      "service_type",
      "address",
    ]);
    if (errorMsg) {
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

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
      return NextResponse.json({
        message: "✅ Application submitted successfully",
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
    console.error("💥 SERVER ERROR (apply-service):", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

