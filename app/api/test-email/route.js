// app/api/test-email/route.js - DELETE after testing
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET() {
  const result = await sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@gangsarunitech.id',
    subject: 'Test Email - Gangsar Unitech',
    html: '<p>Test email berhasil dikirim!</p>'
  });
  return NextResponse.json({
    result,
    smtpUser: process.env.SMTP_USER ? '✅ SET' : '❌ NOT SET',
    smtpPass: process.env.SMTP_PASS ? '✅ SET' : '❌ NOT SET',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@gangsarunitech.id (default)',
  });
}
