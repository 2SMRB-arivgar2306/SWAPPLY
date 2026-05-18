import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

const validPlans = ['medio', 'premium'];

function luhnCheck(value: string) {
  const digits = value.replace(/\D/g, '').split('').reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId, plan, amount, cardNumber, expiry, cvc, cardHolder } = await req.json();

    if (!userId || !plan || amount === undefined || !cardNumber || !expiry || !cvc || !cardHolder) {
      return NextResponse.json({ message: 'Faltan datos del pago.' }, { status: 400 });
    }

    if (!validPlans.includes(plan)) {
      return NextResponse.json({ message: 'Plan no válido para pago.' }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: 'Importe de pago incorrecto.' }, { status: 400 });
    }

    const cleanedCard = cardNumber.replace(/\D/g, '');
    if (!luhnCheck(cleanedCard)) {
      return NextResponse.json({ message: 'Número de tarjeta inválido.' }, { status: 400 });
    }

    const [month, year] = expiry.split('/').map((part: string) => part.trim());
    if (!month || !year || Number(month) < 1 || Number(month) > 12 || year.length !== 2) {
      return NextResponse.json({ message: 'Fecha de expiración inválida.' }, { status: 400 });
    }

    if (!/^[0-9]{3,4}$/.test(cvc)) {
      return NextResponse.json({ message: 'Código CVC inválido.' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    user.plan = plan;
    await user.save();

    return NextResponse.json({ message: 'Pago autorizado. Plan actualizado correctamente.' }, { status: 200 });
  } catch (error) {
    console.error('Payment checkout error:', error);
    return NextResponse.json(
      { message: 'Error procesando el pago', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
