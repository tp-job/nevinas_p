import { Schema, model, type Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    role: string;
    date: string;
    readTime: string;
    category: string;
    imageUrl: string;
    authorAvatar: string;
    created_at: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        role: { type: String, default: '' },
        date: { type: String, required: true },
        readTime: { type: String, default: '5 min read' },
        category: { type: String, default: 'General' },
        imageUrl: { type: String, default: '' },
        authorAvatar: { type: String, default: '' },
        created_at: { type: Date, default: Date.now },
    },
    {
        toJSON: {
            transform(_doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export default model<IBlog>('Blog', blogSchema);
