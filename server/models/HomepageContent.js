import mongoose from 'mongoose';

const homepageContentSchema = new mongoose.Schema({
    heroHeading: String,
    heroSubtitle: String,
    heroCTA: String,
    heroCTALink: String,
    heroMedia: {
        url: String,
        publicId: String,
        type: { type: String, enum: ['image', 'video'], default: 'image' }
    },
    brandStatement: String,
    brandStoryImage: {
        url: String,
        publicId: String
    },
    brandStoryHeading: String,
    brandStoryText: String,
    campaignImage: {
        url: String,
        publicId: String
    },
    campaignHeading: String,
    campaignSubtitle: String,
    campaignCTA: String,
    featuredCollection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    selectedFeaturedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    aboutText: String,
    aboutImage: {
        url: String,
        publicId: String
    },
    whatsappCTAHeading: String,
    whatsappCTAText: String,
    seoTitle: String,
    seoDescription: String
}, { timestamps: true });

// We only ever need one document for the homepage
export const HomepageContent = mongoose.model('HomepageContent', homepageContentSchema);
