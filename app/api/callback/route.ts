import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CallbackRequest from '@/models/CallbackRequest';
import { sendEmail, getRecipients, isEmailConfigured } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, jobTitle, jobSlug, category, source } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name aur phone zaroori hai' }, { status: 400 });
    }

    const phoneClean = String(phone).replace(/\D/g, '');
    if (phoneClean.length < 10) {
      return NextResponse.json({ error: 'Sahi mobile number likhein' }, { status: 400 });
    }

    await connectDB();

    await CallbackRequest.create({
      name: name.trim(),
      phone: phoneClean,
      jobTitle: jobTitle?.trim() || '',
      jobSlug: jobSlug?.trim() || '',
      category: category?.trim() || '',
      source: source?.trim() || 'website',
    });

    if (isEmailConfigured()) {
      const subject = `📞 Callback Request: ${name.trim()} — ${jobTitle || 'General'}`;
      const html = `
        <h2>Naya Callback Request</h2>
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Phone:</strong> ${phoneClean}</p>
        <p><strong>Job:</strong> ${jobTitle || '—'}</p>
        <p><strong>Category:</strong> ${category || '—'}</p>
        <p><strong>Source:</strong> ${source || 'website'}</p>
        <p>Please call back within 24 hours.</p>
      `;
      for (const to of getRecipients()) {
        await sendEmail({ to, subject, html });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Callback request bhej di gayi. Hum jald call karenge.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed';
    console.error('Callback error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
