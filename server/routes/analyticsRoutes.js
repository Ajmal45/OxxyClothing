import express from 'express';
import {
    recordEvent,
    getAnalyticsOverview,
    getProductAnalytics,
    getCollectionAnalytics,
    getMostEnquiredProducts,
    getAnalyticsEvents,
    getTrafficSources,
    getSizeColorBreakdown
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Strict rate limiter for public event recording
const analyticsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: 'Too many analytics events from this IP'
});

// Public Route
router.post('/events', analyticsLimiter, recordEvent);

// Admin Routes
router.get('/admin/analytics/overview', protect, getAnalyticsOverview);
router.get('/admin/analytics/products', protect, getProductAnalytics);
router.get('/admin/analytics/collections', protect, getCollectionAnalytics);
router.get('/admin/analytics/most-enquired', protect, getMostEnquiredProducts);
router.get('/admin/analytics/events', protect, getAnalyticsEvents);
router.get('/admin/analytics/traffic-sources', protect, getTrafficSources);
router.get('/admin/analytics/size-color-breakdown', protect, getSizeColorBreakdown);

export default router;
