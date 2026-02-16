import connectToDatabase from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
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
        const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

        const formatted = favorites.map(fav => ({
            id: fav.articleId,
            title: fav.title,
            image: fav.image,
            condition: fav.condition,
            category: fav.category,
            seeking: fav.seeking,
            user: fav.user,
            location: fav.location,
        }));

        return NextResponse.json(formatted, { status: 200 });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
            { message: 'Error fetching favorites', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        if (!body.userId || !body.articleId) {
            return NextResponse.json(
                { message: 'userId and articleId are required' },
                { status: 400 }
            );
        }

        const favorite = await Favorite.create(body);

        return NextResponse.json(
            { message: 'Favorite added', favorite },
            { status: 201 }
        );
    } catch (error: any) {
        // Duplicate key → already favorited
        if (error.code === 11000) {
            return NextResponse.json(
                { message: 'Already in favorites' },
                { status: 409 }
            );
        }
        console.error('Error adding favorite:', error);
        return NextResponse.json(
            { message: 'Error adding favorite', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const articleId = searchParams.get('articleId');

        if (!userId || !articleId) {
            return NextResponse.json(
                { message: 'userId and articleId are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();
        await Favorite.findOneAndDelete({ userId, articleId });

        return NextResponse.json(
            { message: 'Favorite removed' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
            { message: 'Error removing favorite', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
