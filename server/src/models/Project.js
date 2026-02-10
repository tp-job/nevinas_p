const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    repo_url: String,
    demo_url: String,
    img_url: String,
    topics: [String],
    framework: [String],
    language: [{
        name: String,
        percentage: String
    }],
    tech_stack: [String],
    stargazers_count: {
        type: Number,
        default: 0
    },
    forks_count: {
        type: Number,
        default: 0
    },
    category: String,
    status: String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('Project', projectSchema);