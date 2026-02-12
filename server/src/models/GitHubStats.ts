import { Schema, model, type Document } from 'mongoose';

export interface IMonthlyActivity {
    month: string;
    commits: number;
    prs: number;
    issues: number;
}

export interface IProjectStatus {
    active: number;
    inactive: number;
    archived: number;
}

export interface ITopRepo {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics: string[];
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    pushed_at: string;
}

export interface IGitHubStats extends Document {
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalCreateEvents: number;
    repoCount: number;
    languageDistribution: Map<string, number>;
    monthlyActivity: IMonthlyActivity[];
    commitsByMonth: Map<string, number>;
    dayOfWeekActivity: number[];
    hourActivity: number[];
    projectStatus: IProjectStatus;
    topRepos: ITopRepo[];
    profile: {
        login: string;
        name: string | null;
        avatar_url: string;
        bio: string | null;
        public_repos: number;
        followers: number;
        following: number;
    };
    synced_at: Date;
}

const gitHubStatsSchema = new Schema<IGitHubStats>(
    {
        totalStars: { type: Number, default: 0 },
        totalForks: { type: Number, default: 0 },
        totalCommits: { type: Number, default: 0 },
        totalPRs: { type: Number, default: 0 },
        totalIssues: { type: Number, default: 0 },
        totalCreateEvents: { type: Number, default: 0 },
        repoCount: { type: Number, default: 0 },
        languageDistribution: { type: Map, of: Number, default: {} },
        monthlyActivity: [
            {
                month: String,
                commits: { type: Number, default: 0 },
                prs: { type: Number, default: 0 },
                issues: { type: Number, default: 0 },
            },
        ],
        commitsByMonth: { type: Map, of: Number, default: {} },
        dayOfWeekActivity: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
        hourActivity: { type: [Number], default: new Array(24).fill(0) },
        projectStatus: {
            active: { type: Number, default: 0 },
            inactive: { type: Number, default: 0 },
            archived: { type: Number, default: 0 },
        },
        topRepos: [
            {
                name: String,
                description: { type: String, default: null },
                html_url: String,
                homepage: { type: String, default: null },
                language: { type: String, default: null },
                topics: [String],
                stargazers_count: { type: Number, default: 0 },
                forks_count: { type: Number, default: 0 },
                updated_at: String,
                pushed_at: String,
            },
        ],
        profile: {
            login: String,
            name: { type: String, default: null },
            avatar_url: String,
            bio: { type: String, default: null },
            public_repos: { type: Number, default: 0 },
            followers: { type: Number, default: 0 },
            following: { type: Number, default: 0 },
        },
        synced_at: { type: Date, default: Date.now },
    },
    {
        toJSON: {
            transform(_doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                // Convert Map to plain object for JSON
                if (ret.languageDistribution instanceof Map) {
                    ret.languageDistribution = Object.fromEntries(ret.languageDistribution);
                }
                if (ret.commitsByMonth instanceof Map) {
                    ret.commitsByMonth = Object.fromEntries(ret.commitsByMonth);
                }
            },
        },
    }
);

export default model<IGitHubStats>('GitHubStats', gitHubStatsSchema);
