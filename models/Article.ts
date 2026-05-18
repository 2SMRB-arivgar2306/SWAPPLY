import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this article.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for this article.'],
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category for this article.'],
    },
    condition: {
        type: String,
        required: [true, 'Please provide a condition for this article.'],
    },
    wantsFor: {
        type: String,
        required: [true, 'Please provide what you want in exchange.'],
    },
    image: {
        type: String,
        required: [false, 'Please provide an image URL.'],
    },
    price: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
        required: [true, 'Please provide a location for this article.'],
    },
    features: {
        type: String,
        default: '',
    },
    sellerPlan: {
        type: String,
        default: 'free',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [false, 'User ID is optional for now.'], // Making it optional for initial migration/testing
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
