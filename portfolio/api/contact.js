// api/contact.js — Vercel Serverless Function
// Handles contact form submissions
// To enable email: set RESEND_API_KEY in Vercel Environment Variables
// Get free key at: https://resend.com (100 emails/day free)

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message, phone } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, email, message' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'amazaikhan6677@gmail.com';

  // ── OPTION 1: Resend (Recommended — free 100/day) ──────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Portfolio Contact <onboarding@resend.dev>`,
          to: [CONTACT_EMAIL],
          subject: `Portfolio: ${subject || 'New Contact'} — from ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#6366f1;">New Portfolio Message</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px;color:#666;width:100px;">Name</td><td style="padding:8px;font-weight:600;">${name}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Email</td><td style="padding:8px;">${email}</td></tr>
                ${phone ? `<tr><td style="padding:8px;color:#666;">Phone</td><td style="padding:8px;">${phone}</td></tr>` : ''}
                <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Subject</td><td style="padding:8px;">${subject || 'N/A'}</td></tr>
                <tr><td style="padding:8px;color:#666;vertical-align:top;">Message</td><td style="padding:8px;white-space:pre-line;">${message}</td></tr>
              </table>
              <p style="color:#999;font-size:12px;margin-top:20px;">Sent from your portfolio at ${new Date().toLocaleString()}</p>
            </div>
          `,
          reply_to: email,
        }),
      });
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Resend response error:', response.status, errorBody);
        throw new Error('Email send failed');
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully!' 
      });
    } catch (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  // ── OPTION 2: Formspree (Zero-config alternative) ──────────────────
  // Go to formspree.io, create a form, get your endpoint
  // Set FORMSPREE_ENDPOINT env variable in Vercel
  if (process.env.FORMSPREE_ENDPOINT) {
    try {
      const response = await fetch(process.env.FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message, phone }),
      });

      if (response.ok) {
        return res.status(200).json({ 
          success: true, 
          message: 'Message sent via Formspree!' 
        });
      }
    } catch (err) {
      console.error('Formspree error:', err);
    }
  }

  // ── FALLBACK: No email provider configured ────────────────────────
  console.error('Email service not configured. Set RESEND_API_KEY or FORMSPREE_ENDPOINT in Vercel env vars.');
  return res.status(500).json({ 
    error: 'Email service not configured. Set RESEND_API_KEY or FORMSPREE_ENDPOINT in Vercel env vars.'
  });
}
