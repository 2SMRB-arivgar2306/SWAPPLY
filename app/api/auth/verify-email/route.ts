import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json({ message: 'Faltan datos para la verificación.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'El correo ya está verificado.' }, { status: 200 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ message: 'Código de verificación inválido.' }, { status: 401 });
    }

    user.isVerified = true;
    user.verificationCode = '';
    await user.save();

    return NextResponse.json({ message: 'Correo verificado correctamente.' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { message: 'Error al verificar el correo', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
