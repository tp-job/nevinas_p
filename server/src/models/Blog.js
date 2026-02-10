const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        required: true
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
    category: {
        type: String,
        default: 'General'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    authorAvatar: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);
