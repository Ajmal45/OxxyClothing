import mongoose from 'mongoose';
import { Product } from '../models/Product.js';

const MONGO_URI = process.argv[2];
if (!MONGO_URI) {
    console.error('Usage: node fixAvailability.js <MONGO_URI>');
    process.exit(1);
}

const fixAvailability = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected.');

        const products = await Product.find({ isDeleted: false });
        let fixed = 0;

        for (const product of products) {
            const hasActiveStock = product.variants?.some(v => v.isActive && v.stock > 0);
            if (product.isAvailable !== !!hasActiveStock) {
                await Product.findByIdAndUpdate(product._id, { isAvailable: !!hasActiveStock });
                console.log(`Fixed: ${product.name} → isAvailable: ${!!hasActiveStock}`);
                fixed++;
            }
        }

        console.log(`\nDone. Fixed ${fixed} product(s).`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

fixAvailability();
