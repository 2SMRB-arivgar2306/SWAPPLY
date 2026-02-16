import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required.'],
    },
    articleId: {
        type: String,
        required: [true, 'Article ID is required.'],
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '/placeholder.svg',
    },
    condition: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: '',
    },
    seeking: {
        type: String,
        default: '',
    },
    user: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to prevent duplicate favorites
FavoriteSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
