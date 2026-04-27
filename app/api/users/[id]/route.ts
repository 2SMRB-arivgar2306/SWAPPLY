import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const user = await User.findById(resolvedParams.id).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio || '',
            location: user.location || '',
            avatar: user.avatar || '/placeholder.svg',
            exchanges: user.exchanges || 0,
            rating: user.rating || 0,
            ratingCount: user.ratingCount || 0,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { message: 'Error fetching user', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        await connectToDatabase();
        const resolvedParams = await params;
        const body = await request.json();

        // Only allow updating name, email, bio, location
        const updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.email !== undefined) updateData.email = body.email;
        if (body.bio !== undefined) updateData.bio = body.bio;
        if (body.location !== undefined) updateData.location = body.location;
        if (body.avatar !== undefined) updateData.avatar = body.avatar;

        const updatedUser = await User.findByIdAndUpdate(
            resolvedParams.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio || '',
            location: updatedUser.location || '',
            avatar: updatedUser.avatar || '/placeholder.svg',
            exchanges: updatedUser.exchanges || 0,
            rating: updatedUser.rating || 0,
            ratingCount: updatedUser.ratingCount || 0,
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { message: 'Error updating user', error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
