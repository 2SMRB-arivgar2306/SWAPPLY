import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
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

        // Expect body = { stars: number }
        const stars = Number(body.stars);

        if (isNaN(stars) || stars < 1 || stars > 5) {
            return NextResponse.json(
                { message: 'Invalid rating. Stars must be a number between 1 and 5.' },
                { status: 400 }
            );
        }

        const user = await User.findById(resolvedParams.id).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate new rating mathematically
        const currentTotalStars = (user.rating || 0) * (user.ratingCount || 0);
        const newTotalStars = currentTotalStars + stars;
        const newRatingCount = (user.ratingCount || 0) + 1;
        const newRating = newTotalStars / newRatingCount;

        // Auto increment exchanges count
        const updatedUser = await User.findByIdAndUpdate(
            resolvedParams.id,
            {
                rating: newRating,
                ratingCount: newRatingCount,
                $inc: { exchanges: 1 }
            },
            { new: true, runValidators: true }
        ).select('-password');

        return NextResponse.json({
            message: 'User rated and exchange incremented successfully!',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                exchanges: updatedUser.exchanges,
                rating: updatedUser.rating,
                ratingCount: updatedUser.ratingCount,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error rating user:', error);
        return NextResponse.json(
            { message: 'Error rating user', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
