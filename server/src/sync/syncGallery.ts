import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Gallery from '../models/Gallery';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';

// Base directories (relative to server root)
const SERVER_ROOT = path.join(__dirname, '../..');
const UPLOADS_DIR = path.join(SERVER_ROOT, 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');

interface ImageFile {
    filename: string;
    fullPath: string;
    relativePath: string;
    imgPath: string;
}

// Recursively find all image files
function findImagesRecursive(dir: string, _baseDir: string): ImageFile[] {
    let results: ImageFile[] = [];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findImagesRecursive(fullPath, _baseDir));
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
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');
        console.log(`Scanning: ${IMAGES_DIR}`);

        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`Images directory not found: ${IMAGES_DIR}`);
            process.exit(1);
        }

        const imageFiles = findImagesRecursive(IMAGES_DIR, UPLOADS_DIR);
        console.log(`Found ${imageFiles.length} images on disk`);

        // Step 1: Clean up orphan records
        console.log('\nStep 1: Cleaning up orphan records...');
        const allDbRecords = await Gallery.find({});
        let orphanCount = 0;

        for (const record of allDbRecords) {
            const filePath = path.join(SERVER_ROOT, record.img.replace(/^\//, ''));
            if (!fs.existsSync(filePath)) {
                await Gallery.deleteOne({ _id: record._id });
                console.log(`  Removed orphan: ${record.img}`);
                orphanCount++;
            }
        }
        console.log(`  Records removed: ${orphanCount}`);

        // Step 2: Remove duplicate entries
        console.log('\nStep 2: Removing duplicate entries...');
        const duplicates = await Gallery.aggregate([
            { $group: { _id: '$img', count: { $sum: 1 }, docs: { $push: '$_id' } } },
            { $match: { count: { $gt: 1 } } },
        ]);

        let duplicateCount = 0;
        for (const dup of duplicates) {
            const toDelete = dup.docs.slice(1);
            await Gallery.deleteMany({ _id: { $in: toDelete } });
            duplicateCount += toDelete.length;
            console.log(`  Removed ${toDelete.length} duplicate(s) for: ${dup._id}`);
        }
        console.log(`  Duplicate records removed: ${duplicateCount}`);

        // Step 3: Sync new files to database
        console.log('\nStep 3: Syncing new files...');
        let addedCount = 0;
        let skippedCount = 0;

        for (const image of imageFiles) {
            const existing = await Gallery.findOne({ img: image.imgPath });
            if (!existing) {
                await Gallery.create({
                    name: image.filename,
                    img: image.imgPath,
                    created_at: new Date(),
                });
                console.log(`  Added: ${image.imgPath}`);
                addedCount++;
            } else {
                skippedCount++;
            }
        }

        // Summary
        const finalCount = await Gallery.countDocuments();
        console.log('\nSync Complete!');
        console.log(`  Orphans removed: ${orphanCount}`);
        console.log(`  Duplicates removed: ${duplicateCount}`);
        console.log(`  New files added: ${addedCount}`);
        console.log(`  Already exists: ${skippedCount}`);
        console.log(`  Total in database: ${finalCount}`);
        console.log(`  Total on disk: ${imageFiles.length}`);

        process.exit(0);
    } catch (err) {
        console.error('Error syncing gallery:', err);
        process.exit(1);
    }
}

syncGallery();
