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

    // Support both Gmail and Google Workspace (Business Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // Use STARTTLS
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        // Do not fail on invalid certs (for some Google Workspace setups)
        rejectUnauthorized: false
      }
    });

    // Verify connection before sending
    await transporter.verify();

    await transporter.sendMail({
      from: `Gangsar Unitech <${smtpUser}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
}
