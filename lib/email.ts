// Email service using Resend (recommended for Vercel)
// Install: npm install resend

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: EmailData) {
  // If you have Resend installed and configured
  try {
    // Uncomment when you have Resend API key
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'AI Trip Planner <noreply@aitripplanner.com>',
      to: [process.env.ADMIN_EMAIL || 'support@aitripplanner.com'],
      subject: `New Contact Form Message: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3>Message:</h3>
            <p style="line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              This message was sent from the AI Trip Planner contact form.
            </p>
          </div>
        </div>
      `,
    });
    */

    // For now, just log the email (remove this in production)
    console.log('Email would be sent:', {
      to: process.env.ADMIN_EMAIL || 'support@aitripplanner.com',
      subject: `New Contact Form Message: ${data.subject}`,
      from: data.email,
      message: data.message
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Alternative: Nodemailer implementation
export async function sendContactEmailNodemailer(data: EmailData) {
  // Install: npm install nodemailer @types/nodemailer
  try {
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AI Trip Planner" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Message: ${data.subject}`,
      html: // Same HTML template as above
    });
    */

    return { success: true };
  } catch (error) {
    console.error('Nodemailer sending failed:', error);
    return { success: false, error: 'Failed to send email' };
  }
}