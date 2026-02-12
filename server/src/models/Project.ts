import { Schema, model, type Document } from 'mongoose';

export interface IProjectLanguage {
    name: string;
    percentage: string;
}

export interface IProject extends Document {
    name: string;
    description: string;
    repo_url: string;
    demo_url: string;
    img_url: string;
    topics: string[];
    framework: string[];
    language: IProjectLanguage[];
    tech_stack: string[];
    stargazers_count: number;
    forks_count: number;
    category: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

const projectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        repo_url: { type: String, default: '' },
        demo_url: { type: String, default: '' },
        img_url: { type: String, default: '' },
        topics: { type: [String], default: [] },
        framework: { type: [String], default: [] },
        language: [
            {
                name: { type: String },
                percentage: { type: String },
            },
        ],
        tech_stack: { type: [String], default: [] },
        stargazers_count: { type: Number, default: 0 },
        forks_count: { type: Number, default: 0 },
        category: { type: String, default: '' },
        status: { type: String, default: '' },
        created_at: { type: Date },
        updated_at: { type: Date },
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

export default model<IProject>('Project', projectSchema);
