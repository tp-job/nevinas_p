import { Schema, model, type Document } from 'mongoose';

export interface IGitHubEventPayload {
    action?: string;
    commits?: { sha: string; message: string }[];
    ref?: string;
    ref_type?: string;
}

export interface IGitHubEvent extends Document {
    github_id: string;
    type: string;
    repo: string;
    payload: IGitHubEventPayload;
    event_at: Date;
    synced_at: Date;
}

const gitHubEventSchema = new Schema<IGitHubEvent>(
    {
        github_id: { type: String, required: true },
        type: { type: String, required: true },
        repo: { type: String, required: true },
        payload: {
            action: { type: String },
            commits: [
                {
                    sha: { type: String },
                    message: { type: String },
                },
            ],
            ref: { type: String },
            ref_type: { type: String },
        },
        event_at: { type: Date, required: true },
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

gitHubEventSchema.index({ github_id: 1 }, { unique: true });
gitHubEventSchema.index({ event_at: -1 });
gitHubEventSchema.index({ type: 1 });

export default model<IGitHubEvent>('GitHubEvent', gitHubEventSchema);
