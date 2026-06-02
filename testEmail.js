// Test email configuration
import { sendEmail } from './lib/email.js';

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('SMTP User:', process.env.SMTP_USER);
  console.log('SMTP Host:', process.env.SMTP_HOST);
  
  const result = await sendEmail({
    to: 'admin@gangsarunitech.id',
    subject: 'Test Email - Gangsar Unitech Website',
    html: `
      <h2>Email Configuration Test</h2>
      <p>This is a test email from your Gangsar Unitech website.</p>
      <p>If you receive this, your email configuration is working correctly!</p>
      <hr>
      <p><strong>Configuration Details:</strong></p>
      <ul>
        <li>From: ${process.env.SMTP_USER}</li>
        <li>SMTP Server: ${process.env.SMTP_HOST}</li>
        <li>Port: ${process.env.SMTP_PORT}</li>
      </ul>
      <p>✅ Email system is operational!</p>
    `
  });
  
  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('Check your inbox at: admin@gangsarunitech.id');
  } else {
    console.log('❌ Email failed:', result.message);
  }
}

testEmail();
