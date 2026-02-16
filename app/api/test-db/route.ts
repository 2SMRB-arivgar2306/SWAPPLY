import connectToDatabase from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();
        const state = mongoose.connection.readyState;
        const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];

        return NextResponse.json({
            status: 'success',
            message: 'Connected to MongoDB',
            readyState: state,
            stateName: stateNames[state] || 'unknown'
        }, { status: 200 });
    } catch (error) {
        console.error('Test DB Connection Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to MongoDB',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
