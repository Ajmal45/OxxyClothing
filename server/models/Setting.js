import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    whatsappNumber: { type: String, required: true },
    instagramUrl: String,
    storeEmail: String,
    storePhone: String,
    storeAddress: String,
    socialLinks: [{
        platform: String,
        url: String
    }],
    defaultSEO: {
        title: String,
        description: String,
        keywords: String
    }
}, { timestamps: true });

export const Setting = mongoose.model('Setting', settingSchema);
