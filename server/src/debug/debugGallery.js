require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nevinas';

console.log('Connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('connected');
        const items = await Gallery.find({});
        console.log('Total items:', items.length);
        items.forEach(item => {
            console.log(`- ID: ${item._id} | Name: ${item.name} | Img: "${item.img}"`);
        });
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
