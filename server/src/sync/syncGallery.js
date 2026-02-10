require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Gallery = require('../models/Gallery');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';

// Base directories (relative to server root)
const SERVER_ROOT = path.join(__dirname, '../..');
const UPLOADS_DIR = path.join(SERVER_ROOT, 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');

// Recursively find all image files
function findImagesRecursive(dir, baseDir) {
    let results = [];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findImagesRecursive(fullPath, baseDir));
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (validExtensions.includes(ext)) {
                // Store relative path from uploads dir (e.g. "images/gallery/first/000002.JPG")
                const relativePath = path.relative(UPLOADS_DIR, fullPath).replace(/\\/g, '/');
                results.push({
                    filename: entry.name,
                    fullPath: fullPath,
                    relativePath: relativePath,
                    imgPath: `/uploads/${relativePath}`
                });
            }
        }
    }
    return results;
}

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');
        console.log(`📁 Scanning: ${IMAGES_DIR}`);

        try {
            // Check if directory exists
            if (!fs.existsSync(IMAGES_DIR)) {
                console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
                process.exit(1);
            }

            // Find all image files recursively
            const imageFiles = findImagesRecursive(IMAGES_DIR, UPLOADS_DIR);
            console.log(`📂 Found ${imageFiles.length} images on disk`);

            // ============================
            // STEP 1: Clean up orphan records
            // ============================
            console.log('\n🧹 Step 1: Cleaning up orphan records...');

            const allDbRecords = await Gallery.find({});
            let orphanCount = 0;

            for (const record of allDbRecords) {
                // Build the full file path from the img field
                const filePath = path.join(SERVER_ROOT, record.img.replace(/^\//, ''));
                const fileExists = fs.existsSync(filePath);

                if (!fileExists) {
                    await Gallery.deleteOne({ _id: record._id });
                    console.log(`   🗑️ Removed orphan: ${record.img}`);
                    orphanCount++;
                }
            }

            console.log(`   Records removed: ${orphanCount}`);

            // ============================
            // STEP 2: Remove duplicate entries
            // ============================
            console.log('\n🔄 Step 2: Removing duplicate entries...');

            const duplicates = await Gallery.aggregate([
                {
                    $group: {
                        _id: '$img',
                        count: { $sum: 1 },
                        docs: { $push: '$_id' }
                    }
                },
                {
                    $match: { count: { $gt: 1 } }
                }
            ]);

            let duplicateCount = 0;
            for (const dup of duplicates) {
                const toDelete = dup.docs.slice(1);
                await Gallery.deleteMany({ _id: { $in: toDelete } });
                duplicateCount += toDelete.length;
                console.log(`   🗑️ Removed ${toDelete.length} duplicate(s) for: ${dup._id}`);
            }

            console.log(`   Duplicate records removed: ${duplicateCount}`);

            // ============================
            // STEP 3: Sync new files to database
            // ============================
            console.log('\n📥 Step 3: Syncing new files...');

            let addedCount = 0;
            let skippedCount = 0;

            for (const image of imageFiles) {
                // Check if already exists in DB by img path
                const existing = await Gallery.findOne({ img: image.imgPath });

                if (!existing) {
                    await Gallery.create({
                        name: image.filename,
                        img: image.imgPath,
                        created_at: new Date()
                    });
                    console.log(`   ➕ Added: ${image.imgPath}`);
                    addedCount++;
                } else {
                    skippedCount++;
                }
            }

            // ============================
            // Summary
            // ============================
            const finalCount = await Gallery.countDocuments();

            console.log(`\n✨ Sync Complete!`);
            console.log(`   ────────────────────`);
            console.log(`   Orphans removed: ${orphanCount}`);
            console.log(`   Duplicates removed: ${duplicateCount}`);
            console.log(`   New files added: ${addedCount}`);
            console.log(`   Already exists: ${skippedCount}`);
            console.log(`   ────────────────────`);
            console.log(`   📊 Total in database: ${finalCount}`);
            console.log(`   📂 Total on disk: ${imageFiles.length}`);

            // Debug: Print first 5 items to verify paths
            console.log('\n🔍 Debug: Verifying paths (first 5):');
            const sampleItems = await Gallery.find().limit(5);
            sampleItems.forEach(item => {
                const fullPath = path.join(SERVER_ROOT, item.img.replace(/^\//, ''));
                const exists = fs.existsSync(fullPath) ? '✅' : '❌';
                console.log(`   ${exists} ${item.img}`);
            });

            process.exit(0);
        } catch (error) {
            console.error('❌ Error syncing gallery:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
