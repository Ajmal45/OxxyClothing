import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category.js';
import { Collection } from '../models/Collection.js';
import { Product } from '../models/Product.js';
import { HomepageContent } from '../models/HomepageContent.js';
import { Setting } from '../models/Setting.js';

dotenv.config();

const img = (id, w = 800, h = 1000) => ({
    url: `https://picsum.photos/seed/${id}/${w}/${h}`,
    publicId: `seed/${id}`,
    altText: id.replace(/-/g, ' '),
    width: w,
    height: h,
});

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        await Category.deleteMany();
        await Collection.deleteMany();
        await Product.deleteMany();
        await HomepageContent.deleteMany();
        await Setting.deleteMany();
        console.log('Cleared existing data.');

        const categories = await Category.insertMany([
            { name: 'Dresses', slug: 'dresses', description: 'Elegant dresses for every occasion', displayOrder: 1, image: img('cat-dress', 600, 400) },
            { name: 'Tops & Blouses', slug: 'tops', description: 'Chic tops and blouses to elevate your look', displayOrder: 2, image: img('cat-tops', 600, 400) },
            { name: 'Bottoms', slug: 'bottoms', description: 'Pants, skirts, and shorts', displayOrder: 3, image: img('cat-bottoms', 600, 400) },
            { name: 'Ethnic Wear', slug: 'ethnic', description: 'Traditional and contemporary ethnic styles', displayOrder: 4, image: img('cat-ethnic', 600, 400) },
            { name: 'Accessories', slug: 'accessories', description: 'Bags, jewelry, and more', displayOrder: 5, image: img('cat-accessories', 600, 400) },
            { name: 'Outerwear', slug: 'outerwear', description: 'Jackets, coats, and layering pieces', displayOrder: 6, image: img('cat-outerwear', 600, 400) },
        ]);
        console.log(`Created ${categories.length} categories.`);

        const colData = [
            { name: 'Summer 2026', slug: 'summer-2026', description: 'Light, breezy pieces for the warm season', isFeatured: true, displayOrder: 1, coverImage: img('col-summer', 1200, 800) },
            { name: 'Evening Elegance', slug: 'evening-elegance', description: 'Sophisticated styles for nights out', isFeatured: true, displayOrder: 2, coverImage: img('col-evening', 1200, 800) },
            { name: 'Casual Chic', slug: 'casual-chic', description: 'Effortless everyday style', isFeatured: true, displayOrder: 3, coverImage: img('col-casual', 1200, 800) },
            { name: 'Ethereal Whites', slug: 'ethereal-whites', description: 'Timeless white pieces for a fresh look', isFeatured: false, displayOrder: 4, coverImage: img('col-whites', 1200, 800) },
            { name: 'Urban Street', slug: 'urban-street', description: 'Bold streetwear-inspired fashion', isFeatured: false, displayOrder: 5, coverImage: img('col-urban', 1200, 800) },
            { name: 'Wedding Edit', slug: 'wedding-edit', description: 'Stunning ensembles for wedding celebrations', isFeatured: true, displayOrder: 6, coverImage: img('col-wedding', 1200, 800) },
        ];
        const collections = await Collection.insertMany(colData);
        console.log(`Created ${collections.length} collections.`);

        const catMap = Object.fromEntries(categories.map(c => [c.slug, c._id]));
        const colMap = Object.fromEntries(collections.map(c => [c.slug, c._id]));

        const sizes = ['XS', 'S', 'M', 'L', 'XL'];
        const colors = ['Black', 'White', 'Beige', 'Navy', 'Dusty Rose'];
        const makeVariants = () => sizes.slice(0, 3).flatMap(size =>
            colors.slice(0, 2).map(color => ({
                size, color, stock: Math.floor(Math.random() * 15) + 1, isActive: true
            }))
        );

        const products = await Product.insertMany([
            {
                name: 'Midi Wrap Dress', slug: 'midi-wrap-dress', productCode: 'DRS-001',
                description: 'A flattering midi wrap dress in lightweight crepe. Perfect for brunch or an evening out.',
                price: 3490, category: catMap.dresses, collections: [colMap['summer-2026'], colMap['casual-chic']],
                images: [img('prod-wrap-dress', 800, 1000), img('prod-wrap-dress-2', 800, 1000)],
                variants: makeVariants(), isFeatured: true, isNewArrival: true, displayOrder: 1,
            },
            {
                name: 'Linen A-Line Dress', slug: 'linen-a-line-dress', productCode: 'DRS-002',
                description: 'Breathable linen A-line dress with a relaxed silhouette. Ideal for summer days.',
                price: 2990, category: catMap.dresses, collections: [colMap['summer-2026']],
                images: [img('prod-linen-dress', 800, 1000), img('prod-linen-dress-2', 800, 1000)],
                variants: makeVariants(), isFeatured: false, isNewArrival: true, displayOrder: 2,
            },
            {
                name: 'Sequin Evening Gown', slug: 'sequin-evening-gown', productCode: 'DRS-003',
                description: 'Show-stopping sequin gown with a thigh-high slit. Made for memorable nights.',
                price: 7990, category: catMap.dresses, collections: [colMap['evening-elegance']],
                images: [img('prod-sequin-gown', 800, 1000), img('prod-sequin-gown-2', 800, 1000)],
                variants: [{ size: 'S', color: 'Black', stock: 5, isActive: true }, { size: 'M', color: 'Black', stock: 3, isActive: true }],
                isFeatured: true, isNewArrival: false, displayOrder: 3,
            },
            {
                name: 'Ribbed Knit Top', slug: 'ribbed-knit-top', productCode: 'TOP-001',
                description: 'Soft ribbed knit top with a flattering V-neck. A wardrobe essential.',
                price: 1290, category: catMap.tops, collections: [colMap['casual-chic'], colMap['summer-2026']],
                images: [img('prod-ribbed-top', 800, 1000), img('prod-ribbed-top-2', 800, 1000)],
                variants: makeVariants(), isFeatured: true, isNewArrival: true, displayOrder: 4,
            },
            {
                name: 'Silk Blouse', slug: 'silk-blouse', productCode: 'TOP-002',
                description: 'Luxurious silk blouse with mother-of-pearl buttons. Transitions seamlessly from office to evening.',
                price: 2490, category: catMap.tops, collections: [colMap['evening-elegance']],
                images: [img('prod-silk-blouse', 800, 1000), img('prod-silk-blouse-2', 800, 1000)],
                variants: makeVariants(), isFeatured: true, isNewArrival: false, displayOrder: 5,
            },
            {
                name: 'Oversized Cotton Tee', slug: 'oversized-cotton-tee', productCode: 'TOP-003',
                description: 'Premium organic cotton oversized tee. Relaxed fit, effortlessly cool.',
                price: 990, category: catMap.tops, collections: [colMap['casual-chic'], colMap['urban-street']],
                images: [img('prod-cotton-tee', 800, 1000), img('prod-cotton-tee-2', 800, 1000)],
                variants: makeVariants(), isFeatured: false, isNewArrival: true, displayOrder: 6,
            },
            {
                name: 'High-Waist Wide Leg Pants', slug: 'wide-leg-pants', productCode: 'BTN-001',
                description: 'Tailored wide-leg pants with a high waist. Elongates the silhouette beautifully.',
                price: 2790, category: catMap.bottoms, collections: [colMap['casual-chic'], colMap['summer-2026']],
                images: [img('prod-wide-pants', 800, 1000), img('prod-wide-pants-2', 800, 1000)],
                variants: makeVariants(), isFeatured: true, isNewArrival: true, displayOrder: 7,
            },
            {
                name: 'Pleated Midi Skirt', slug: 'pleated-midi-skirt', productCode: 'BTN-002',
                description: 'Flowing pleated midi skirt in satin finish. Moves beautifully with every step.',
                price: 2290, category: catMap.bottoms, collections: [colMap['evening-elegance']],
                images: [img('prod-pleated-skirt', 800, 1000), img('prod-pleated-skirt-2', 800, 1000)],
                variants: makeVariants(), isFeatured: false, isNewArrival: false, displayOrder: 8,
            },
            {
                name: 'Embroidered Anarkali Suit', slug: 'anarkali-suit', productCode: 'ETH-001',
                description: 'Hand-embroidered Anarkali suit with matching palazzo pants. Timeless elegance.',
                price: 5990, category: catMap.ethnic, collections: [colMap['wedding-edit']],
                images: [img('prod-anarkali', 800, 1000), img('prod-anarkali-2', 800, 1000)],
                variants: [{ size: 'S', color: 'Dusty Rose', stock: 4, isActive: true }, { size: 'M', color: 'Dusty Rose', stock: 6, isActive: true }, { size: 'L', color: 'Dusty Rose', stock: 3, isActive: true }],
                isFeatured: true, isNewArrival: true, displayOrder: 9,
            },
            {
                name: 'Printed Kurti Set', slug: 'printed-kurti-set', productCode: 'ETH-002',
                description: 'Contemporary printed kurti with tapered pants. Modern ethnic at its best.',
                price: 3490, category: catMap.ethnic, collections: [colMap['summer-2026']],
                images: [img('prod-kurti-set', 800, 1000), img('prod-kurti-set-2', 800, 1000)],
                variants: makeVariants(), isFeatured: false, isNewArrival: true, displayOrder: 10,
            },
            {
                name: 'Structured Crossbody Bag', slug: 'crossbody-bag', productCode: 'ACC-001',
                description: 'Minimalist structured crossbody bag in vegan leather. The perfect finishing touch.',
                price: 1890, category: catMap.accessories, collections: [colMap['casual-chic']],
                images: [img('prod-crossbody', 800, 800)],
                variants: [{ size: 'One Size', color: 'Black', stock: 10, isActive: true }, { size: 'One Size', color: 'Beige', stock: 8, isActive: true }],
                isFeatured: true, isNewArrival: false, displayOrder: 11,
            },
            {
                name: 'Layered Chain Necklace', slug: 'chain-necklace', productCode: 'ACC-002',
                description: 'Delicate layered chain necklace in gold-plated stainless steel.',
                price: 890, category: catMap.accessories, collections: [colMap['evening-elegance']],
                images: [img('prod-necklace', 800, 800)],
                variants: [{ size: 'One Size', color: 'Gold', stock: 20, isActive: true }],
                isFeatured: false, isNewArrival: true, displayOrder: 12,
            },
            {
                name: 'Cropped Blazer', slug: 'cropped-blazer', productCode: 'OUT-001',
                description: 'Sharp cropped blazer with padded shoulders. Power dressing redefined.',
                price: 4290, category: catMap.outerwear, collections: [colMap['evening-elegance'], colMap['urban-street']],
                images: [img('prod-blazer', 800, 1000), img('prod-blazer-2', 800, 1000)],
                variants: makeVariants(), isFeatured: true, isNewArrival: true, displayOrder: 13,
            },
            {
                name: 'Flowy Maxi Dress', slug: 'flowy-maxi-dress', productCode: 'DRS-004',
                description: 'Romantic flowy maxi dress with tiered skirt and puff sleeves.',
                price: 4590, category: catMap.dresses, collections: [colMap['wedding-edit'], colMap['ethereal-whites']],
                images: [img('prod-maxi-dress', 800, 1000), img('prod-maxi-dress-2', 800, 1000)],
                variants: makeVariants(), isFeatured: true, isNewArrival: true, displayOrder: 14,
            },
            {
                name: 'Denim Jacket', slug: 'denim-jacket', productCode: 'OUT-002',
                description: 'Classic oversized denim jacket. An all-season layering essential.',
                price: 2690, category: catMap.outerwear, collections: [colMap['casual-chic'], colMap['urban-street']],
                images: [img('prod-denim-jacket', 800, 1000)],
                variants: makeVariants(), isFeatured: false, isNewArrival: false, displayOrder: 15,
            },
            {
                name: 'Tassel Earrings', slug: 'tassel-earrings', productCode: 'ACC-003',
                description: 'Statement tassel earrings in vibrant colors. Instant outfit elevator.',
                price: 690, category: catMap.accessories, collections: [colMap['wedding-edit']],
                images: [img('prod-earrings', 800, 800)],
                variants: [{ size: 'One Size', color: 'Dusty Rose', stock: 15, isActive: true }, { size: 'One Size', color: 'Navy', stock: 12, isActive: true }],
                isFeatured: false, isNewArrival: true, displayOrder: 16,
            },
        ]);
        console.log(`Created ${products.length} products.`);

        await HomepageContent.create({
            heroHeading: 'Defining Modern Elegance',
            heroSubtitle: 'Curated fashion for the woman who knows her worth. Timeless pieces, contemporary vision.',
            heroCTA: 'Explore Collection',
            heroCTALink: '/collections/summer-2026',
            heroMedia: img('hero-homepage', 1920, 1080),
            brandStatement: 'Fashion is not something that exists in dresses only. Fashion is in the sky, in the street.',
            brandStoryHeading: 'Our Story',
            brandStoryText: 'OXXY was born from a simple belief: every woman deserves access to fashion that makes her feel powerful, confident, and authentically herself. We curate collections that blend timeless elegance with contemporary edge.',
            brandStoryImage: img('brand-story', 1200, 800),
            campaignHeading: 'The Summer Edit',
            campaignSubtitle: 'New arrivals just dropped. Light fabrics, bold prints, endless possibilities.',
            campaignCTA: 'Shop Summer',
            campaignImage: img('campaign-summer', 1400, 600),
            featuredCollection: colMap['summer-2026'],
            selectedFeaturedProducts: products.slice(0, 8).map(p => p._id),
            aboutText: 'OXXY is a complete women\'s fashion destination offering premium clothing, ethnic wear, and accessories. From everyday essentials to statement pieces, we have something for every moment.',
            aboutImage: img('about-oxxy', 1400, 600),
            whatsappCTAHeading: 'Need Styling Advice?',
            whatsappCTAText: 'Our fashion consultants are just a message away. Get personalized recommendations delivered straight to your WhatsApp.',
            seoTitle: 'OXXY — Complete Women Store',
            seoDescription: 'Discover premium women\'s fashion at OXXY. Curated collections of dresses, tops, ethnic wear, and accessories for the modern woman.',
        });
        console.log('Homepage content seeded.');

        await Setting.create({
            whatsappNumber: '919876543210',
            storeEmail: 'hello@oxxy.in',
            storePhone: '+91 98765 43210',
            storeAddress: 'OXXY Flagship Store, 42 Fashion Avenue, Mumbai, Maharashtra 400001',
            instagramUrl: 'https://instagram.com/oxxy',
            defaultSEO: {
                title: 'OXXY — Complete Women Store',
                description: 'Premium women\'s fashion and clothing. Shop curated collections of dresses, tops, ethnic wear, and accessories.',
                keywords: 'women fashion, dresses, ethnic wear, premium clothing, OXXY'
            }
        });
        console.log('Settings seeded.');

        console.log('\nSeeding complete! Run the client to see your store.');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
