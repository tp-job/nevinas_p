import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from '../services/fileManager';
import type { IGallery } from '../types/models';

// Gallery assets are served by the CLIENT, not this server.
//
// The client deploys as a standalone static site on a different origin from the
// API, so a relative "/uploads/..." path in gallery.json resolves against the
// frontend host. Serving these files from server/uploads therefore 404'd in
// production no matter what — and server/uploads was gitignored, so the files
// were never deployed either. They now live in client/public, which Vite copies
// to dist/ and the static host serves same-origin from its CDN.
//
// Resolves identically from src/sync (ts-node-dev) and dist/sync (compiled).
const REPO_ROOT = path.join(__dirname, '../../..');
const PUBLIC_ROOT = path.join(REPO_ROOT, 'client', 'public');
const UPLOADS_DIR = path.join(PUBLIC_ROOT, 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');

interface ImageFile {
    filename: string;
    fullPath: string;
    relativePath: string;
    imgPath: string;
}

// Recursively find all image files
function findImagesRecursive(dir: string): ImageFile[] {
    let results: ImageFile[] = [];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findImagesRecursive(fullPath));
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (validExtensions.includes(ext)) {
                const relativePath = path.relative(UPLOADS_DIR, fullPath).replace(/\\/g, '/');
                results.push({
                    filename: entry.name,
                    fullPath,
                    relativePath,
                    imgPath: `/uploads/${relativePath}`,
                });
            }
        }
    }
    return results;
}

async function syncGallery(): Promise<void> {
    try {
        dataStore.init();
        console.log(`Scanning: ${IMAGES_DIR}`);

        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`Images directory not found: ${IMAGES_DIR}`);
            process.exit(1);
        }

        const imageFiles = findImagesRecursive(IMAGES_DIR);
        console.log(`Found ${imageFiles.length} images on disk`);

        const currentGallery = dataStore.gallery.readAll();

        // Step 1: Clean up orphan records (in DB but not on disk)
        console.log('\nStep 1: Cleaning up orphan records...');
        let orphanCount = 0;
        const cleaned = currentGallery.filter((record) => {
            const filePath = path.join(PUBLIC_ROOT, record.img.replace(/^\//, ''));
            if (!fs.existsSync(filePath)) {
                console.log(`  Removed orphan: ${record.img}`);
                orphanCount++;
                return false;
            }
            return true;
        });
        console.log(`  Records removed: ${orphanCount}`);

        // Step 2: Remove duplicate entries (same img path)
        console.log('\nStep 2: Removing duplicate entries...');
        const seen = new Set<string>();
        let duplicateCount = 0;
        const deduped = cleaned.filter((record) => {
            if (seen.has(record.img)) {
                console.log(`  Removed duplicate: ${record.img}`);
                duplicateCount++;
                return false;
            }
            seen.add(record.img);
            return true;
        });
        console.log(`  Duplicate records removed: ${duplicateCount}`);

        // Step 3: Sync new files
        console.log('\nStep 3: Syncing new files...');
        let addedCount = 0;
        let skippedCount = 0;

        const existingPaths = new Set(deduped.map((r) => r.img));
        const newRecords: IGallery[] = [];

        for (const image of imageFiles) {
            if (!existingPaths.has(image.imgPath)) {
                newRecords.push({
                    id: uuidv4(),
                    name: image.filename,
                    img: image.imgPath,
                    created_at: new Date().toISOString(),
                });
                console.log(`  Added: ${image.imgPath}`);
                addedCount++;
            } else {
                skippedCount++;
            }
        }

        const finalGallery = [...deduped, ...newRecords];
        dataStore.gallery.writeAll(finalGallery);

        // Summary
        console.log('\nSync Complete!');
        console.log(`  Orphans removed: ${orphanCount}`);
        console.log(`  Duplicates removed: ${duplicateCount}`);
        console.log(`  New files added: ${addedCount}`);
        console.log(`  Already exists: ${skippedCount}`);
        console.log(`  Total in data: ${finalGallery.length}`);
        console.log(`  Total on disk: ${imageFiles.length}`);

        process.exit(0);
    } catch (err) {
        console.error('Error syncing gallery:', err);
        process.exit(1);
    }
}

syncGallery();
