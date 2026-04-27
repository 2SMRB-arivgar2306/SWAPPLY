import connectToDatabase from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const body = await request.json();

        if (!body.sender || !body.text || !body.time) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const chat = await Chat.findById(resolvedParams.id);

        if (!chat) {
            return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
        }

        const newMessage = {
            sender: body.sender,
            text: body.text,
            time: body.time,
            image: body.image,
            isSystem: body.isSystem
        };

        chat.messages.push(newMessage);
        chat.lastMessage = body.text || 'Imagen enviada';
        chat.lastTime = body.time;
        // Skip unread count calculation given symmetric DB structure for now

        await chat.save();

        return NextResponse.json({ message: 'Message added successfully', data: chat.messages[chat.messages.length - 1] }, { status: 201 });
    } catch (error) {
        console.error('Error adding chat message:', error);
        return NextResponse.json(
            { message: 'Error adding message', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
