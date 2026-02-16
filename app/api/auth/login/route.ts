import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Por favor, completa todos los campos.' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find user
        // Explicitly type user or cast to avoid 'any' error if needed, though with models it should be fine.
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'Credenciales inválidas.' },
                { status: 401 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Credenciales inválidas.' },
                { status: 401 }
            );
        }

        // Return user info (excluding password)
        return NextResponse.json(
            {
                message: 'Login exitoso',
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    bio: user.bio || '',
                    location: user.location || '',
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Error durante el inicio de sesión', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
