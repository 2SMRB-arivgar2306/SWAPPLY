import mongoose from 'mongoose';

const MessageSubSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['me', 'other'],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
}, { _id: true });

const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required.'],
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '👤',
    },
    lastMessage: {
        type: String,
        default: '',
    },
    lastTime: {
        type: String,
        default: '',
    },
    unread: {
        type: Number,
        default: 0,
    },
    messages: [MessageSubSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
