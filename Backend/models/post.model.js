import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }, // Markdown content
    category: {
        type: String,
        enum: ['technology', 'lifestyle', 'education', 'business', 'design', 'development', 'data-science', 'gaming', 'travel', 'food', 'news', 'finance', 'opinion', 'career', 'other'],
        required: true
    },
    image: {
        url: String,
        public_id: String
    },
    author: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }, username: {
            type: String,
            required: true,
        },
    }
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
