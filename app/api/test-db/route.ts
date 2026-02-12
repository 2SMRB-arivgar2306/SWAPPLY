import connectToDatabase from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();
        return NextResponse.json({ status: 'success', message: 'Connected to MongoDB' });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to connect to MongoDB', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
