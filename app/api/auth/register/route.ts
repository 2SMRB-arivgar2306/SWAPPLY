import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

async function sendWelcomeEmail(name: string, email: string) {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const userId = process.env.EMAILJS_USER_ID || process.env.EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !userId) {
        console.warn('EmailJS no está configurado en las variables de entorno. No se enviará el correo.');
        return;
    }

    const payload: Record<string, unknown> = {
        service_id: serviceId,
        template_id: templateId,
        template_params: {
            user_name: name,
            user_email: email,
        },
    };

    if (process.env.EMAILJS_USER_ID) {
        payload.user_id = userId;
    } else {
        payload.public_key = userId;
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EmailJS error: ${response.status} ${response.statusText} - ${errorText}`);
    }
}

export async function POST(req: Request) {
    try {
        const { name, email, password, location } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Por favor, completa todos los campos.' },
                { status: 400 }
            );
        }

        if (String(password).length < 6) {
            return NextResponse.json(
                { message: 'La contraseña debe tener al menos 6 caracteres.' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Ya existe una cuenta con este correo.' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            location: location || '',
            plan: '',
        });

        try {
            await sendWelcomeEmail(name, email);
        } catch (emailError) {
            console.error('EmailJS error:', emailError);
        }

        return NextResponse.json(
            {
                message: 'Registro exitoso',
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    bio: user.bio || '',
                    location: user.location || '',
                    plan: user.plan || '',
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { message: 'Error durante el registro', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
