import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    return NextResponse.json(
        { message: 'El registro de usuarios está deshabilitado.' },
        { status: 403 }
    );
}
