import connectToDatabase from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const chat = await Chat.findById(params.id);

        if (!chat) {
            return NextResponse.json(
                { message: 'Chat not found' },
                { status: 404 }
            );
        }

        const messages = chat.messages.map((msg: any) => ({
            id: msg._id,
            sender: msg.sender,
            text: msg.text,
            time: msg.time,
        }));

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { message: 'Error fetching messages', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const body = await request.json();

        if (!body.text || !body.sender) {
            return NextResponse.json(
                { message: 'text and sender are required' },
                { status: 400 }
            );
        }

        const time = body.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        const chat = await Chat.findByIdAndUpdate(
            params.id,
            {
                $push: {
                    messages: {
                        sender: body.sender,
                        text: body.text,
                        time: time,
                    }
                },
                $set: {
                    lastMessage: body.text,
                    lastTime: time,
                }
            },
            { new: true }
        );

        if (!chat) {
            return NextResponse.json(
                { message: 'Chat not found' },
                { status: 404 }
            );
        }

        const newMessage = chat.messages[chat.messages.length - 1];

        return NextResponse.json(
            {
                message: 'Message sent',
                data: {
                    id: newMessage._id,
                    sender: newMessage.sender,
                    text: newMessage.text,
                    time: newMessage.time,
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { message: 'Error sending message', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
