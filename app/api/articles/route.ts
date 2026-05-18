import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        const articles = await Article.find({})
            .populate('userId', 'name location')
            .sort({ createdAt: -1 });

        const formattedArticles = articles.map(article => ({
            id: article._id.toString(),
            userId: article.userId?._id?.toString ? article.userId._id.toString() : (article.userId ? article.userId.toString() : ''),
            user: article.userId?.name || 'Usuario',
            location: article.location || article.userId?.location || 'Sin ubicación',
            title: article.title,
            description: article.description,
            category: article.category,
            condition: article.condition,
            wantsFor: article.wantsFor,
            image: article.image,
            price: article.price || 0,
            features: article.features || '',
            sellerPlan: article.sellerPlan || 'free'
        }));

        return NextResponse.json(formattedArticles, { status: 200 });
    } catch (error) {
        console.error('Error fetching articles:', error);
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

        if (!body.title || !body.description || !body.category || !body.condition || !body.wantsFor || !body.location) {
            return NextResponse.json(
                { message: 'Faltan campos obligatorios del artículo.' },
                { status: 400 }
            );
        }

        const newArticle = await Article.create({
            title: body.title,
            description: body.description,
            category: body.category,
            condition: body.condition,
            wantsFor: body.wantsFor,
            image: body.image,
            location: body.location,
            price: Number(body.price) || 0,
            features: body.features || '',
            userId: body.userId,
            sellerPlan: body.sellerPlan || 'free',
        });
        const populated = await newArticle.populate('userId', 'name location');

        return NextResponse.json(
            {
                message: 'Article created successfully',
                article: {
                    id: populated._id.toString(),
                    userId: populated.userId?._id?.toString ? populated.userId._id.toString() : (populated.userId ? populated.userId.toString() : ''),
                    user: populated.userId?.name || 'Usuario',
                    location: populated.location || populated.userId?.location || 'Sin ubicación',
                    title: populated.title,
                    description: populated.description,
                    category: populated.category,
                    condition: populated.condition,
                    wantsFor: populated.wantsFor,
                    image: populated.image,
                    price: populated.price || 0,
                    features: populated.features || '',
                    sellerPlan: populated.sellerPlan || 'free',
                }
            },
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
