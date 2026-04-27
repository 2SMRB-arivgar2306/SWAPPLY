import mongoose from 'mongoose';

const MessageSubSchema = new mongoose.Schema({
    sender: {
        type: String,
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
    image: {
        type: String,
        required: false,
    },
    isSystem: {
        type: Boolean,
        default: false,
    }
}, { _id: true });

const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required.'],
    },
    otherUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
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
