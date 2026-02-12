import { Schema, model, type Document } from 'mongoose';

export interface IGitHubRepo extends Document {
    github_id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics: string[];
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    open_issues_count: number;
    size: number;
    fork: boolean;
    archived: boolean;
    visibility: string;
    default_branch: string;
    pushed_at: Date;
    github_created_at: Date;
    github_updated_at: Date;
    synced_at: Date;
}

const gitHubRepoSchema = new Schema<IGitHubRepo>(
    {
        github_id: { type: Number, required: true },
        name: { type: String, required: true },
        full_name: { type: String, required: true },
        description: { type: String, default: null },
        html_url: { type: String, default: '' },
        homepage: { type: String, default: null },
        language: { type: String, default: null },
        topics: { type: [String], default: [] },
        stargazers_count: { type: Number, default: 0 },
        forks_count: { type: Number, default: 0 },
        watchers_count: { type: Number, default: 0 },
        open_issues_count: { type: Number, default: 0 },
        size: { type: Number, default: 0 },
        fork: { type: Boolean, default: false },
        archived: { type: Boolean, default: false },
        visibility: { type: String, default: 'public' },
        default_branch: { type: String, default: 'main' },
        pushed_at: { type: Date },
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

gitHubRepoSchema.index({ github_id: 1 }, { unique: true });
gitHubRepoSchema.index({ pushed_at: -1 });
gitHubRepoSchema.index({ stargazers_count: -1 });

export default model<IGitHubRepo>('GitHubRepo', gitHubRepoSchema);
