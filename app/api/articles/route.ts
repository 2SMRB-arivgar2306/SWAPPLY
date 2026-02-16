import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        // Mapping _id to id for frontend compatibility if needed
        // We can do this in the frontend or backend. Doing it here for clarity.
        const articles = await Article.find({}).sort({ createdAt: -1 });

        const formattedArticles = articles.map(article => ({
            id: article._id,
            title: article.title,
            description: article.description,
            category: article.category,
            condition: article.condition,
            wantsFor: article.wantsFor,
            image: article.image
        }));

        return NextResponse.json(formattedArticles, { status: 200 });
    } catch (error) {
        console.error('Detailed Error fetching articles:', error);
        return NextResponse.json(
            { message: 'Error fetching articles', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // Basic validation could go here, relying on Mongoose schema mostly
        const newArticle = await Article.create(body);

        return NextResponse.json(
            { message: 'Article created successfully', article: newArticle },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json(
            { message: 'Error creating article', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
