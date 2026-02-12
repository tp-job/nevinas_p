import { Schema, model, type Document } from 'mongoose';

export interface IGitHubProfile extends Document {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;
    location: string | null;
    blog: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    github_created_at: Date;
    github_updated_at: Date;
    synced_at: Date;
}

const gitHubProfileSchema = new Schema<IGitHubProfile>(
    {
        login: { type: String, required: true, unique: true },
        name: { type: String, default: null },
        avatar_url: { type: String, default: '' },
        html_url: { type: String, default: '' },
        bio: { type: String, default: null },
        location: { type: String, default: null },
        blog: { type: String, default: null },
        public_repos: { type: Number, default: 0 },
        public_gists: { type: Number, default: 0 },
        followers: { type: Number, default: 0 },
        following: { type: Number, default: 0 },
        github_created_at: { type: Date },
        github_updated_at: { type: Date },
        synced_at: { type: Date, default: Date.now },
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

export default model<IGitHubProfile>('GitHubProfile', gitHubProfileSchema);
