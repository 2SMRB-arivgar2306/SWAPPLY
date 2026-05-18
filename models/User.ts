import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this user.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email for this user.'],
        maxlength: [60, 'Email cannot be more than 60 characters'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password for this user.'],
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters'],
        default: '',
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot be more than 100 characters'],
        default: '',
    },
    avatar: {
        type: String,
        default: '/placeholder.svg'
    },
    plan: {
        type: String,
        enum: ['free', 'medio', 'premium', ''],
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: ''
    },
    exchanges: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
