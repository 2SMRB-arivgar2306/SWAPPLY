import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

function loadEnv(file) {
  const env = {};
  try {
    const data = fs.readFileSync(file, 'utf8');
    for (const line of data.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx);
      let val = trimmed.slice(idx + 1);
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  } catch (e) {
    console.error('Could not read env file', e.message);
  }
  return env;
}

const envPath = path.resolve(process.cwd(), '.env.local');
const fileEnv = loadEnv(envPath);
for (const k of Object.keys(fileEnv)) {
  if (!process.env[k]) process.env[k] = fileEnv[k];
}

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

console.log('Using SMTP:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER ? process.env.SMTP_USER.replace(/.(?=.{3})/g, '*') : undefined,
});

(async () => {
  try {
    const info = await transporter.verify();
    console.log('SMTP verify OK:', info);
    // Try a test send to the configured user to see if sendMail throws
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const to = process.env.SMTP_USER;
    try {
      const sendInfo = await transporter.sendMail({
        from,
        to,
        subject: 'Prueba SMTP Swapply',
        text: 'Este es un email de prueba para verificar la configuración SMTP.',
      });
      console.log('Test email sent:', sendInfo);
    } catch (sendErr) {
      console.error('sendMail failed:', sendErr);
    }
  } catch (err) {
    console.error('SMTP verify failed:', err);
  }
})();
