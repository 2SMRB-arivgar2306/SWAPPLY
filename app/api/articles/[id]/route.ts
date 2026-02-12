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
        const article = await Article.findById(params.id);

        if (!article) {
            return NextResponse.json(
                { message: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: article._id,
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
        });

        if (!updatedArticle) {
            return NextResponse.json(
                { message: 'Article not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Article updated successfully', article: updatedArticle },
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
