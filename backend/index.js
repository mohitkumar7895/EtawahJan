import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { serviceApplicationTemplate, contactFormTemplate } from './emailTemplates.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// DONO EMAILS YAHAN HAI - DIRECTLY HARDCODED
const RECIPIENTS = [
  'dhaniramsingh711@gmail.com',
  'mohitporwal596@gmail.com'
];

const FROM_ADDRESS = 'Jun Seva Kendra <onboarding@resend.dev>';

console.log('✅ Server starting...');
console.log('📧 Emails configured:', RECIPIENTS);

// Service Application Form
app.post('/api/apply-service', async (req, res) => {
  try {
    const { name, email, mobile: phone, service_type: service, address } = req.body;

    if (!name || !phone || !service || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('\n🔥 NEW SERVICE APPLICATION 🔥');
    console.log('From:', name, phone);
    console.log('Service:', service);

    // PEHLE EMAIL - DHANI KO
    let dhaniResult = { success: false, error: null };
    try {
      console.log('📤 Sending to dhaniramsingh711@gmail.com...');
      const result1 = await resend.emails.send({
        from: FROM_ADDRESS,
        to: 'dhaniramsingh711@gmail.com',
        subject: `🔔 New Service Application - ${service}`,
        html: serviceApplicationTemplate({ name, email, phone, service, address }),
      });
      console.log('✅ DHANI - Email sent!', result1.id);
      dhaniResult.success = true;
      dhaniResult.id = result1.id;
    } catch (err) {
      console.error('❌ DHANI - Failed:', err.message);
      dhaniResult.error = err.message;
    }

    // Wait 1 second between emails
    await new Promise(resolve => setTimeout(resolve, 1000));

    // DOOSRA EMAIL - MOHIT KO
    let mohitResult = { success: false, error: null };
    try {
      console.log('📤 Sending to mohitporwal596@gmail.com...');
      const result2 = await resend.emails.send({
        from: FROM_ADDRESS,
        to: 'mohitporwal596@gmail.com',
        subject: `🔔 New Service Application - ${service}`,
        html: serviceApplicationTemplate({ name, email, phone, service, address }),
      });
      console.log('✅ MOHIT - Email sent!', result2.id);
      mohitResult.success = true;
      mohitResult.id = result2.id;
    } catch (err) {
      console.error('❌ MOHIT - Failed:', err.message);
      mohitResult.error = err.message;
    }

    console.log('\n📊 FINAL RESULTS:');
    console.log('Dhani:', dhaniResult.success ? '✅ SUCCESS' : '❌ FAILED -', dhaniResult.error);
    console.log('Mohit:', mohitResult.success ? '✅ SUCCESS' : '❌ FAILED -', mohitResult.error);

    // At least one success = form submission successful
    if (dhaniResult.success || mohitResult.success) {
      return res.json({ 
        message: 'Application submitted successfully',
        dhani: dhaniResult,
        mohit: mohitResult
      });
    }

    // Both failed
    return res.status(500).json({ 
      error: 'Email sending failed',
      dhani: dhaniResult,
      mohit: mohitResult
    });

  } catch (error) {
    console.error('💥 SERVER ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('\n💬 NEW CONTACT MESSAGE 💬');
    console.log('From:', name, email);

    // PEHLE EMAIL - DHANI KO
    let dhaniResult = { success: false, error: null };
    try {
      console.log('📤 Sending to dhaniramsingh711@gmail.com...');
      const result1 = await resend.emails.send({
        from: FROM_ADDRESS,
        to: 'dhaniramsingh711@gmail.com',
        subject: `💬 New Contact Message from ${name}`,
        html: contactFormTemplate({ name, email, message }),
      });
      console.log('✅ DHANI - Email sent!', result1.id);
      dhaniResult.success = true;
      dhaniResult.id = result1.id;
    } catch (err) {
      console.error('❌ DHANI - Failed:', err.message);
      dhaniResult.error = err.message;
    }

    // Wait 1 second between emails
    await new Promise(resolve => setTimeout(resolve, 1000));

    // DOOSRA EMAIL - MOHIT KO
    let mohitResult = { success: false, error: null };
    try {
      console.log('📤 Sending to mohitporwal596@gmail.com...');
      const result2 = await resend.emails.send({
        from: FROM_ADDRESS,
        to: 'mohitporwal596@gmail.com',
        subject: `💬 New Contact Message from ${name}`,
        html: contactFormTemplate({ name, email, message }),
      });
      console.log('✅ MOHIT - Email sent!', result2.id);
      mohitResult.success = true;
      mohitResult.id = result2.id;
    } catch (err) {
      console.error('❌ MOHIT - Failed:', err.message);
      mohitResult.error = err.message;
    }

    console.log('\n📊 FINAL RESULTS:');
    console.log('Dhani:', dhaniResult.success ? '✅ SUCCESS' : '❌ FAILED -', dhaniResult.error);
    console.log('Mohit:', mohitResult.success ? '✅ SUCCESS' : '❌ FAILED -', mohitResult.error);

    // At least one success = form submission successful
    if (dhaniResult.success || mohitResult.success) {
      return res.json({ 
        message: 'Message sent successfully',
        dhani: dhaniResult,
        mohit: mohitResult
      });
    }

    // Both failed
    return res.status(500).json({ 
      error: 'Email sending failed',
      dhani: dhaniResult,
      mohit: mohitResult
    });

  } catch (error) {
    console.error('💥 SERVER ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log('📧 Emails will be sent to:');
  console.log('   1. dhaniramsingh711@gmail.com');
  console.log('   2. mohitporwal596@gmail.com');
  console.log('✅ Ready to receive forms!\n');
});