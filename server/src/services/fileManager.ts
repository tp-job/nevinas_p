/**
 * File-based data manager with in-memory caching, atomic writes,
 * concurrent write guards, and corruption recovery.
 *
 * Replaces Mongoose models as the data access layer.
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type {
    IBlog,
    IProject,
    IGallery,
    IGitHubData,
} from '../types/models';

// ---------------------------------------------------------------------------
// Write Lock — in-process async mutex for concurrent write protection
// ---------------------------------------------------------------------------

class WriteLock {
    private queue: Promise<void> = Promise.resolve();

    async acquire<T>(fn: () => Promise<T> | T): Promise<T> {
        let release!: () => void;
        const next = new Promise<void>((r) => {
            release = r;
        });
        const prev = this.queue;
        this.queue = next;
        await prev;
        try {
            return await fn();
        } finally {
            release();
        }
    }
}

// ---------------------------------------------------------------------------
// FileManager<T> — generic CRUD over a JSON file
// ---------------------------------------------------------------------------

class FileManager<T> {
    private filePath: string;
    private cache: T | null = null;
    private lock = new WriteLock();

    constructor(filename: string, dataDir: string) {
        this.filePath = path.join(dataDir, filename);
    }

    // ===== READ =====

    /** Read all data (from cache or disk). */
    readAll(): T {
        if (this.cache !== null) return this.cache;

        try {
            const raw = fs.readFileSync(this.filePath, 'utf-8');
            this.cache = JSON.parse(raw) as T;
            return this.cache;
        } catch {
            // Try backup
            const bakPath = this.filePath + '.bak';
            if (fs.existsSync(bakPath)) {
                console.warn(`[FileManager] Primary file corrupted, using backup: ${bakPath}`);
                const raw = fs.readFileSync(bakPath, 'utf-8');
                this.cache = JSON.parse(raw) as T;
                // Restore primary from backup
                fs.copyFileSync(bakPath, this.filePath);
                return this.cache;
            }
            throw new Error(`[FileManager] Cannot read data file: ${this.filePath}`);
        }
    }

    // ===== WRITE (atomic) =====

    /**
     * Atomic write with corruption guard:
     *   1. Write to .tmp
     *   2. Rename current → .bak
     *   3. Rename .tmp → target (atomic on same FS)
     */
    writeAll(data: T): void {
        const tmpPath = this.filePath + '.tmp';
        const bakPath = this.filePath + '.bak';
        const serialized = JSON.stringify(data, null, 2);

        // Step 1: write to temp file
        fs.writeFileSync(tmpPath, serialized, 'utf-8');

        // Step 2: backup current file (if exists)
        if (fs.existsSync(this.filePath)) {
            fs.renameSync(this.filePath, bakPath);
        }

        // Step 3: atomic rename tmp → target
        fs.renameSync(tmpPath, this.filePath);

        // Update cache
        this.cache = data;
    }

    /** Force re-read from disk on next access. */
    invalidateCache(): void {
        this.cache = null;
    }

    /** Get the underlying file path (for diagnostics). */
    getFilePath(): string {
        return this.filePath;
    }

    // ===== Acquire lock for external use =====

    async withLock<R>(fn: () => Promise<R> | R): Promise<R> {
        return this.lock.acquire(fn);
    }
}

// ---------------------------------------------------------------------------
// ArrayFileManager<T> — CRUD helpers for array-based JSON files
// ---------------------------------------------------------------------------

interface HasId {
    id: string;
}

class ArrayFileManager<T extends HasId> extends FileManager<T[]> {
    /** Find a single record by id. */
    findById(id: string): T | undefined {
        return this.readAll().find((item) => item.id === id);
    }

    /** Create a new record with auto-generated UUID. */
    async create(item: Omit<T, 'id'>): Promise<T> {
        return this.withLock(() => {
            const data = [...this.readAll()];
            const newItem = { ...item, id: uuidv4() } as T;
            data.push(newItem);
            this.writeAll(data);
            return newItem;
        });
    }

    /** Update a record by id. Returns updated record or undefined if not found. */
    async updateById(id: string, update: Partial<T>): Promise<T | undefined> {
        return this.withLock(() => {
            const data = [...this.readAll()];
            const index = data.findIndex((item) => item.id === id);
            if (index === -1) return undefined;
            data[index] = { ...data[index], ...update, id }; // preserve id
            this.writeAll(data);
            return data[index];
        });
    }

    /** Delete a record by id. Returns true if found & deleted. */
    async deleteById(id: string): Promise<boolean> {
        return this.withLock(() => {
            const data = this.readAll();
            const filtered = data.filter((item) => item.id !== id);
            if (filtered.length === data.length) return false;
            this.writeAll(filtered);
            return true;
        });
    }
}

// ---------------------------------------------------------------------------
// DataStore — singleton that exposes all stores
// ---------------------------------------------------------------------------

class DataStore {
    blogs!: ArrayFileManager<IBlog>;
    projects!: ArrayFileManager<IProject>;
    gallery!: ArrayFileManager<IGallery>;
    github!: FileManager<IGitHubData>;

    private initialized = false;

    /**
     * Initialize all file managers.
     * Must be called once on server startup.
     */
    init(dataDir?: string): void {
        if (this.initialized) return;

        const dir = dataDir || process.env.DATA_DIR || path.join(__dirname, '../data');
        const resolvedDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);

        if (!fs.existsSync(resolvedDir)) {
            fs.mkdirSync(resolvedDir, { recursive: true });
        }

        this.blogs = new ArrayFileManager<IBlog>('blogs.json', resolvedDir);
        this.projects = new ArrayFileManager<IProject>('projects.json', resolvedDir);
        this.gallery = new ArrayFileManager<IGallery>('gallery.json', resolvedDir);
        this.github = new FileManager<IGitHubData>('github.json', resolvedDir);

        // Validate that files exist and are readable
        const files = ['blogs.json', 'projects.json', 'gallery.json', 'github.json'];
        for (const file of files) {
            const fp = path.join(resolvedDir, file);
            if (!fs.existsSync(fp)) {
                // Create empty defaults
                const isGithub = file === 'github.json';
                const defaultData = isGithub
                    ? { profiles: [], events: [], repos: [], stats: [] }
                    : [];
                fs.writeFileSync(fp, JSON.stringify(defaultData, null, 2), 'utf-8');
                console.log(`[DataStore] Created empty data file: ${file}`);
            }
        }

        this.initialized = true;
        console.log(`[DataStore] Initialized with data directory: ${resolvedDir}`);
    }

    /** Check if store is ready. */
    isReady(): boolean {
        return this.initialized;
    }
}

/** Singleton instance */
export const dataStore = new DataStore();
