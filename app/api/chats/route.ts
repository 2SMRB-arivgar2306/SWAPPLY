import connectToDatabase from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'userId is required' },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

        const formatted = chats.map(chat => ({
            id: chat._id,
            name: chat.name,
            avatar: chat.avatar,
            lastMessage: chat.lastMessage,
            lastTime: chat.lastTime,
            unread: chat.unread,
            messages: chat.messages.map((msg: any) => ({
                id: msg._id,
                sender: msg.sender,
                text: msg.text,
                time: msg.time,
            })),
        }));

        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        console.error('Error fetching chats:', error);
        return NextResponse.json(
            { message: 'Error fetching chats', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        if (!body.userId || !body.name) {
            return NextResponse.json(
                { message: 'userId and name are required' },
                { status: 400 }
            );
        }

        const chat = await Chat.create({
            userId: body.userId,
            name: body.name,
            avatar: body.avatar || '👤',
            lastMessage: '',
            lastTime: '',
            unread: 0,
            messages: [],
        });

        return NextResponse.json(
            {
                message: 'Chat created',
                chat: {
                    id: chat._id,
                    name: chat.name,
                    avatar: chat.avatar,
                    lastMessage: chat.lastMessage,
                    lastTime: chat.lastTime,
                    unread: chat.unread,
                    messages: [],
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating chat:', error);
        return NextResponse.json(
            { message: 'Error creating chat', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
