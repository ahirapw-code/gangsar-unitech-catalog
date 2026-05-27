import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  try {
    // Check if email credentials are configured
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    
    if (!smtpUser || !smtpPass || smtpUser.includes('your-email')) {
      console.log('Email credentials not configured. Email would have been sent:');
      console.log({ to, subject });
      return { success: false, message: 'Email credentials not configured' };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `Gangsar Unitech <${smtpUser}>`,
      to,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
}