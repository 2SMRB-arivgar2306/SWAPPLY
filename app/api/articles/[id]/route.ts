import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const article = await Article.findById(params.id).populate('userId', 'name location');

        if (!article) {
            return NextResponse.json(
                { message: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: article._id.toString(),
            userId: article.userId?._id?.toString ? article.userId._id.toString() : (article.userId ? article.userId.toString() : ''),
            user: article.userId?.name || 'Usuario',
            location: article.userId?.location || 'Sin ubicación',
            title: article.title,
            description: article.description,
            category: article.category,
            condition: article.condition,
            wantsFor: article.wantsFor,
            image: article.image
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json(
            { message: 'Error fetching article', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const updatedArticle = await Article.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        }).populate('userId', 'name location');

        if (!updatedArticle) {
            return NextResponse.json(
                { message: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Article updated successfully',
                article: {
                    id: updatedArticle._id.toString(),
                    userId: updatedArticle.userId?._id?.toString ? updatedArticle.userId._id.toString() : (updatedArticle.userId ? updatedArticle.userId.toString() : ''),
                    user: updatedArticle.userId?.name || 'Usuario',
                    location: updatedArticle.userId?.location || 'Sin ubicación',
                    title: updatedArticle.title,
                    description: updatedArticle.description,
                    category: updatedArticle.category,
                    condition: updatedArticle.condition,
                    wantsFor: updatedArticle.wantsFor,
                    image: updatedArticle.image,
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json(
            { message: 'Error updating article', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const deletedArticle = await Article.findByIdAndDelete(params.id);

        if (!deletedArticle) {
            return NextResponse.json(
                { message: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Article deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json(
            { message: 'Error deleting article', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
