import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

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
