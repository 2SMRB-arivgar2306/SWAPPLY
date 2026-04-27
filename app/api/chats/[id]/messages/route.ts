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
            time: body.time
        };

        chat.messages.push(newMessage);
        chat.lastMessage = body.text;
        chat.lastTime = body.time;
        if (body.sender !== 'me') {
            chat.unread += 1;
        }

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
