import 'dotenv/config';
import mongoose from 'mongoose';
import Gallery from '../models/Gallery';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';

console.log('Connecting to', MONGODB_URI);

async function debug(): Promise<void> {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected');
        const items = await Gallery.find({});
        console.log('Total items:', items.length);
        items.forEach((item) => {
            console.log(`- ID: ${item._id} | Name: ${item.name} | Img: "${item.img}"`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
