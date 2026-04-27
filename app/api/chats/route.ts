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
        const chats = await Chat.find({
            $or: [{ userId: userId }, { otherUserId: userId }]
        }).sort({ createdAt: -1 }).populate('userId otherUserId', 'name avatar');

        const formatted = chats.map(chat => {
            // Determine name and avatar based on if the current user is initiator or target
            const isInitiator = String(chat.userId?._id) === userId;
            const targetName = isInitiator ? chat.name : (chat.userId?.name || 'Usuario');
            const targetAvatar = isInitiator ? chat.avatar : (chat.userId?.avatar || '👤');
            const trueOtherUserId = isInitiator ? chat.otherUserId?._id : chat.userId?._id;

            return {
                id: chat._id,
                userId: trueOtherUserId,
                name: targetName,
                avatar: targetAvatar,
                lastMessage: chat.lastMessage,
                lastTime: chat.lastTime,
                unread: chat.unread,
                messages: chat.messages.map((msg: any) => ({
                    id: msg._id,
                    sender: String(msg.sender) === 'me'
                        ? (isInitiator ? 'me' : 'other')
                        : (isInitiator ? 'other' : 'me'), // Flip perspectives
                    text: msg.text,
                    time: msg.time,
                    image: msg.image,
                    isSystem: msg.isSystem
                })),
            }
        });

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

        // Check if chat already exists
        const existingChat = await Chat.findOne({
            $or: [
                { userId: body.userId, otherUserId: body.otherUserId },
                { userId: body.otherUserId, otherUserId: body.userId }
            ]
        });

        if (existingChat) {
            return NextResponse.json({ message: 'Chat exists', chat: existingChat }, { status: 200 });
        }

        const chat = await Chat.create({
            userId: body.userId,
            otherUserId: body.otherUserId, // Ensure the partner sees it
            name: body.name,
            avatar: body.avatar || '👤',
            lastMessage: body.initialMessage || 'Interesado en tus artículos',
            lastTime: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            unread: 0,
            messages: [{
                sender: 'me',
                text: body.initialMessage || 'Interesado en tus artículos',
                time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            }],
        });

        return NextResponse.json(
            {
                message: 'Chat created',
                chat: chat
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
