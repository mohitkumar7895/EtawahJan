import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Get environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENTS = process.env.RECIPIENT_EMAILS 
  ? process.env.RECIPIENT_EMAILS.split(',').map(email => email.trim())
  : ["dhaniramsingh711@gmail.com", "mohitporwal596@gmail.com"];
// Gmail SMTP configuration (fallback)
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Use Gmail address if available for better deliverability
const FROM_ADDRESS = process.env.FROM_EMAIL || 
  (GMAIL_USER ? `Jan Seva Kendra <${GMAIL_USER}>` : "Jan Seva Kendra <onboarding@resend.dev>");

// Initialize Resend
let resend: Resend | null = null;
if (RESEND_API_KEY) {
  try {
    resend = new Resend(RESEND_API_KEY);
    console.log('✅ Resend initialized');
  } catch (err) {
    console.error('❌ Failed to initialize Resend:', err);
  }
}

// Initialize Nodemailer (Gmail fallback)
let nodemailerTransporter: nodemailer.Transporter | null = null;
if (GMAIL_USER && GMAIL_APP_PASSWORD) {
  try {
    nodemailerTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
    console.log('✅ Nodemailer (Gmail) initialized');
  } catch (err) {
    console.error('❌ Failed to initialize Nodemailer:', err);
  }
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
  method?: 'resend' | 'nodemailer';
  details?: any;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  // Try Resend first
  if (resend) {
    try {
      console.log(`\n📤 [Resend] ==========================================`);
      console.log(`📤 [Resend] Attempting to send email`);
      console.log(`📤 [Resend] To: ${to}`);
      console.log(`📤 [Resend] From: ${FROM_ADDRESS}`);
      console.log(`📤 [Resend] Subject: ${subject}`);
      console.log(`📤 [Resend] API Key: ${RESEND_API_KEY ? RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
      
      // Create plain text version for better deliverability
      const textVersion = html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();

      const response = await resend.emails.send({
        from: FROM_ADDRESS,
        to,
        subject,
        html,
        text: textVersion,
        reply_to: GMAIL_USER || 'noreply@jansevakendra.com',
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'Precedence': 'bulk',
          'X-Auto-Response-Suppress': 'All',
          'Auto-Submitted': 'auto-generated',
        },
      });

      console.log(`📤 [Resend] Full Response:`, JSON.stringify(response, null, 2));

      // Check for error in response first
      const responseError = (response as any)?.error;
      if (responseError) {
        const errorMsg = responseError.message || 'Resend API error';
        const isTestingModeError = errorMsg.includes('only send testing emails') || 
                                   errorMsg.includes('verify a domain');
        
        if (isTestingModeError) {
          console.warn(`⚠️ [Resend] Testing mode restriction detected`);
          console.warn(`⚠️ [Resend] Resend can only send to verified email: mohitporwal596@gmail.com`);
          console.warn(`⚠️ [Resend] Will try Gmail fallback for ${to}...`);
          // Throw error to trigger fallback, but mark it as testing mode error
          const err = new Error(errorMsg);
          (err as any).isTestingModeError = true;
          (err as any).response = { data: null, error: responseError };
          throw err;
        } else {
          throw new Error(errorMsg);
        }
      }

      // Resend v2 API returns { data: { id: ... } }
      const messageId = (response as any)?.data?.id || (response as any)?.id;

      if (messageId) {
        console.log(`✅ [Resend] ✅✅✅ EMAIL SENT SUCCESSFULLY ✅✅✅`);
        console.log(`✅ [Resend] To: ${to}`);
        console.log(`✅ [Resend] Message ID: ${messageId}`);
        console.log(`✅ [Resend] ==========================================\n`);
        return { success: true, id: messageId, method: 'resend' };
      } else {
        console.error(`❌ [Resend] No message ID in response`);
        console.error(`❌ [Resend] Response structure:`, response);
        throw new Error("No message ID returned from Resend API. Response: " + JSON.stringify(response));
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Unknown error';
      const errorDetails = err?.response?.data || err?.response?.body || err?.response || err;
      
      // Check if it's a Resend validation error (testing mode restriction)
      const isTestingModeError = errorDetails?.error?.message?.includes('only send testing emails') || 
                                  errorDetails?.error?.message?.includes('verify a domain');
      
      console.error(`\n❌ [Resend] ==========================================`);
      console.error(`❌ [Resend] EMAIL SENDING FAILED`);
      console.error(`❌ [Resend] To: ${to}`);
      console.error(`❌ [Resend] Error: ${errorMessage}`);
      if (isTestingModeError) {
        console.error(`❌ [Resend] ⚠️ RESEND TESTING MODE RESTRICTION`);
        console.error(`❌ [Resend] Resend only allows sending to verified email in testing mode`);
        console.error(`❌ [Resend] Will try Gmail fallback if configured...`);
      }
      console.error(`❌ [Resend] Full Error:`, JSON.stringify(errorDetails, null, 2));
      console.error(`❌ [Resend] ==========================================\n`);
      
      // If it's testing mode error, try Gmail fallback
      if (isTestingModeError && nodemailerTransporter) {
        console.log(`🔄 [Resend] Trying Gmail fallback for ${to}...`);
        // Don't return yet, let it fall through to Gmail
      } else {
        // For other errors, return immediately
        return { 
          success: false, 
          error: errorMessage, 
          method: 'resend',
          details: errorDetails 
        };
      }
    }
  }

  // Fallback to Nodemailer (Gmail) - if Resend failed or not available
  if (nodemailerTransporter) {
    try {
      console.log(`\n📤 [Gmail] ==========================================`);
      console.log(`📤 [Gmail] Attempting to send email (fallback)`);
      console.log(`📤 [Gmail] To: ${to}`);
      
      // Create plain text version from HTML for better deliverability
      const textVersion = html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ') // Remove extra spaces
        .trim();

      // Use Gmail address directly for better deliverability
      const fromAddress = GMAIL_USER || FROM_ADDRESS;
      const displayName = 'Jan Seva Kendra - Etawah';
      
      // Clean subject - remove spam trigger words
      const cleanSubject = subject
        .replace(/[🔔💬⚠️]/g, '') // Remove emojis
        .replace(/URGENT/gi, '')
        .replace(/IMPORTANT/gi, '')
        .trim();

      const info = await nodemailerTransporter.sendMail({
        from: `"${displayName}" <${fromAddress}>`,
        to,
        subject: cleanSubject,
        html,
        text: textVersion,
        replyTo: fromAddress,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'X-Mailer': 'Jan Seva Kendra',
          'Message-ID': `<${Date.now()}-${Math.random().toString(36)}@jansevakendra.com>`,
          'X-Auto-Response-Suppress': 'All',
          'Precedence': 'bulk',
        },
        priority: 'high',
        // Add date header
        date: new Date(),
      });

      console.log(`✅ [Gmail] ✅✅✅ EMAIL SENT SUCCESSFULLY ✅✅✅`);
      console.log(`✅ [Gmail] To: ${to}`);
      console.log(`✅ [Gmail] Message ID: ${info.messageId}`);
      console.log(`✅ [Gmail] ==========================================\n`);
      return { 
        success: true, 
        id: info.messageId, 
        method: 'nodemailer',
        details: info 
      };
    } catch (err: any) {
      console.error(`\n❌ [Gmail] ==========================================`);
      console.error(`❌ [Gmail] EMAIL SENDING FAILED`);
      console.error(`❌ [Gmail] Error: ${err?.message || err}`);
      console.error(`❌ [Gmail] ==========================================\n`);
      return { 
        success: false, 
        error: err?.message || 'Unknown error', 
        method: 'nodemailer',
        details: err 
      };
    }
  }

  // No email service configured
  const errorMsg = 'No email service configured. Please set either RESEND_API_KEY or GMAIL_USER + GMAIL_APP_PASSWORD in .env.local';
  console.error(`❌ ${errorMsg}`);
  return { success: false, error: errorMsg };
}

export function getRecipients(): string[] {
  return RECIPIENTS;
}

export function isEmailConfigured(): boolean {
  return !!(resend || nodemailerTransporter);
}

