/**
 * One-time script: Clean MongoDB-specific fields (_id, __v) from migrated JSON files
 * and replace with UUID-based `id` fields.
 *
 * Usage: npx ts-node-dev --transpile-only src/sync/cleanData.ts
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataDir = path.join(__dirname, '../data');

interface MongoRecord {
    _id?: string;
    __v?: number;
    id?: string;
    [key: string]: unknown;
}

function cleanRecord(record: MongoRecord): MongoRecord {
    const { _id, __v, ...rest } = record;
    return { id: uuidv4(), ...rest };
}

function cleanNestedRecord(record: MongoRecord): MongoRecord {
    const cleaned = cleanRecord(record);
    // Clean nested _id fields (e.g. in language arrays)
    for (const [key, value] of Object.entries(cleaned)) {
        if (Array.isArray(value)) {
            cleaned[key] = value.map((item: unknown) => {
                if (item && typeof item === 'object' && '_id' in (item as MongoRecord)) {
                    const { _id, __v, ...itemRest } = item as MongoRecord;
                    return itemRest;
                }
                return item;
            });
        }
    }
    return cleaned;
}

function cleanArrayFile(filename: string): void {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`  Skipped (not found): ${filename}`);
        return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as MongoRecord[];
    const cleaned = data.map(cleanNestedRecord);
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf-8');
    console.log(`  Cleaned ${cleaned.length} records in ${filename}`);
}

function cleanGitHubFile(): void {
    const filePath = path.join(dataDir, 'github.json');
    if (!fs.existsSync(filePath)) {
        console.log('  Skipped (not found): github.json');
        return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    data.profiles = (data.profiles || []).map(cleanRecord);
    data.events = (data.events || []).map(cleanRecord);
    data.repos = (data.repos || []).map(cleanRecord);
    data.stats = (data.stats || []).map((stat: MongoRecord) => {
        const cleaned = cleanRecord(stat);
        // Clean nested _id in topRepos and monthlyActivity
        if (Array.isArray(cleaned.topRepos)) {
            cleaned.topRepos = (cleaned.topRepos as MongoRecord[]).map((r) => {
                const { _id, ...rest } = r;
                return rest;
            });
        }
        if (Array.isArray(cleaned.monthlyActivity)) {
            cleaned.monthlyActivity = (cleaned.monthlyActivity as MongoRecord[]).map((m) => {
                const { _id, ...rest } = m;
                return rest;
            });
        }
        return cleaned;
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  Cleaned github.json: ${data.profiles.length} profiles, ${data.events.length} events, ${data.repos.length} repos, ${data.stats.length} stats`);
}

// ===== Main =====
console.log('Cleaning MongoDB fields from data files...');
console.log(`Data directory: ${dataDir}\n`);

cleanArrayFile('blogs.json');
cleanArrayFile('projects.json');
cleanArrayFile('gallery.json');
cleanGitHubFile();

// Delete users.json (no longer needed)
const usersFile = path.join(dataDir, 'users.json');
if (fs.existsSync(usersFile)) {
    fs.unlinkSync(usersFile);
    console.log('\n  Deleted users.json');
}

// Delete duplicate files (blog.json, project.json)
for (const dup of ['blog.json', 'project.json']) {
    const dupPath = path.join(dataDir, dup);
    if (fs.existsSync(dupPath)) {
        fs.unlinkSync(dupPath);
        console.log(`  Deleted duplicate: ${dup}`);
    }
}

console.log('\nDone! All data files cleaned.');
