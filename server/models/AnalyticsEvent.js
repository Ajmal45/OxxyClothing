import mongoose from 'mongoose';
import { ANALYTICS_EVENTS } from '../utils/constants.js';

const analyticsEventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        enum: Object.values(ANALYTICS_EVENTS)
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    selectedSize: String,
    selectedColor: String,
    source: String,
    referrer: String,
    // Note: TTL index of 90 days. We don't want analytics to grow infinitely.
    // 90 days of retention is typical for lightweight first-party analytics on a standard web host.
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 } 
});

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ productId: 1 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
