import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function verifySMTP() {
  try {
    const info = await transporter.verify();
    return { ok: true, info };
  } catch (error) {
    return { ok: false, error };
  }
}

export { transporter };

export async function sendVerificationEmail(email: string, name: string, code: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP configuration missing. Verification email not sent.');
    return false;
  }

  const fromEmail = process.env.SMTP_FROM || 'Swapply <noreply@swapply.com>';

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Código de verificación Swapply',
      html: `
        <div style="font-family: Arial, sans-serif; color: #111;">
          <h2>Bienvenido a Swapply, ${name}</h2>
          <p>Tu código de verificación es:</p>
          <p style="font-size: 24px; font-weight: 700;">${code}</p>
          <p>Ingresa este código en la aplicación para verificar tu correo.</p>
          <p>Si no solicitaste este correo, ignóralo.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}
