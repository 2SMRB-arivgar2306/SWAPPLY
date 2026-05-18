import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: 'Falta userId' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'Usuario ya verificado', emailSent: false }, { status: 200 });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    await user.save();

    const sent = await sendVerificationEmail(user.email, user.name || user.email, newCode);
    return NextResponse.json({ message: sent ? 'Correo reenviado' : 'No se pudo enviar correo', emailSent: !!sent }, { status: sent ? 200 : 500 });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ message: 'Error reenviando correo', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
