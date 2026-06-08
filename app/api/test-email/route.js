import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Show exact values (masked) for debugging
  const debugInfo = {
    smtpUser: smtpUser || 'NOT SET',
    smtpUserLength: smtpUser?.length,
    smtpPassLength: smtpPass?.length,
    smtpPassFirst4: smtpPass?.substring(0, 4),
    smtpPassLast4: smtpPass?.substring(smtpPass.length - 4),
    hasSpaces: smtpPass?.includes(' '),
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // use service instead of host/port
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `Gangsar Unitech <${smtpUser}>`,
      to: smtpUser,
      subject: 'Test Email Gangsar Unitech',
      html: '<p>Email berhasil!</p>',
    });

    return NextResponse.json({ success: true, debugInfo });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      debugInfo 
    });
  }
}
