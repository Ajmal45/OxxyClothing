import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { Product } from '../models/Product.js';
import { Collection } from '../models/Collection.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiPaginatedResponse, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import joi from 'joi';
import { ANALYTICS_EVENTS } from '../utils/constants.js';

// @desc    Record an analytics event
// @route   POST /api/analytics/events
// @access  Public
export const recordEvent = asyncHandler(async (req, res) => {
    const schema = joi.object({
        eventType: joi.string().valid(...Object.values(ANALYTICS_EVENTS)).required(),
        productId: joi.string().hex().length(24).optional(),
        collectionId: joi.string().hex().length(24).optional(),
        selectedSize: joi.string().optional(),
        selectedColor: joi.string().optional(),
        source: joi.string().optional(),
        referrer: joi.string().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        throw new ApiError(400, error.details[0].message);
    }

    if (value.productId) {
        const productExists = await Product.findById(value.productId);
        if (!productExists) throw new ApiError(404, 'Product not found');
    }

    if (value.collectionId) {
        const collectionExists = await Collection.findById(value.collectionId);
        if (!collectionExists) throw new ApiError(404, 'Collection not found');
    }

    await AnalyticsEvent.create(value);
    
    // We don't send data back to keep response lightweight
    res.status(201).json(new ApiResponse(201, null, 'Event recorded successfully'));
});

// @desc    Get analytics overview
// @route   GET /api/admin/analytics/overview
// @access  Private/Admin
export const getAnalyticsOverview = asyncHandler(async (req, res) => {
    const totalEvents = await AnalyticsEvent.countDocuments();
    
    // Simple aggregation for recent views
    const recentViews = await AnalyticsEvent.aggregate([
        { $match: { eventType: ANALYTICS_EVENTS.PRODUCT_VIEW } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        { $limit: 7 }
    ]);

    const totalWhatsAppClicks = await AnalyticsEvent.countDocuments({ eventType: ANALYTICS_EVENTS.WHATSAPP_CLICK });
    const totalProductViews = await AnalyticsEvent.countDocuments({ eventType: ANALYTICS_EVENTS.PRODUCT_VIEW });
    const totalCollectionViews = await AnalyticsEvent.countDocuments({ eventType: ANALYTICS_EVENTS.COLLECTION_VIEW });

    res.status(200).json(new ApiResponse(200, {
        totalEvents,
        recentProductViews: recentViews,
        totalWhatsAppClicks,
        totalProductViews,
        totalCollectionViews,
    }, 'Analytics overview fetched successfully'));
});

// @desc    Get top products analytics
// @route   GET /api/admin/analytics/products
// @access  Private/Admin
export const getProductAnalytics = asyncHandler(async (req, res) => {
    const topProducts = await AnalyticsEvent.aggregate([
        { $match: { eventType: ANALYTICS_EVENTS.PRODUCT_VIEW, productId: { $exists: true } } },
        { $group: { _id: "$productId", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
        { $unwind: "$productDetails" },
        { $project: { _id: 1, views: 1, "productDetails.name": 1, "productDetails.productCode": 1 } }
    ]);

    res.status(200).json(new ApiResponse(200, topProducts, 'Product analytics fetched successfully'));
});

// @desc    Get top collections analytics
// @route   GET /api/admin/analytics/collections
// @access  Private/Admin
export const getCollectionAnalytics = asyncHandler(async (req, res) => {
    const topCollections = await AnalyticsEvent.aggregate([
        { $match: { eventType: ANALYTICS_EVENTS.COLLECTION_VIEW, collectionId: { $exists: true } } },
        { $group: { _id: "$collectionId", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'collections', localField: '_id', foreignField: '_id', as: 'collectionDetails' } },
        { $unwind: "$collectionDetails" },
        { $project: { _id: 1, views: 1, "collectionDetails.name": 1 } }
    ]);

    res.status(200).json(new ApiResponse(200, topCollections, 'Collection analytics fetched successfully'));
});

// @desc    Get most enquired products (by WhatsApp clicks)
// @route   GET /api/admin/analytics/most-enquired
// @access  Private/Admin
export const getMostEnquiredProducts = asyncHandler(async (req, res) => {
    const mostEnquired = await AnalyticsEvent.aggregate([
        { $match: { eventType: ANALYTICS_EVENTS.WHATSAPP_CLICK, productId: { $exists: true } } },
        { $group: { _id: "$productId", enquiries: { $sum: 1 }, sizes: { $addToSet: "$selectedSize" }, colors: { $addToSet: "$selectedColor" } } },
        { $sort: { enquiries: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
        { $unwind: "$productDetails" },
        { $project: { _id: 1, enquiries: 1, sizes: 1, colors: 1, "productDetails.name": 1, "productDetails.productCode": 1 } }
    ]);

    res.status(200).json(new ApiResponse(200, mostEnquired, 'Most enquired products fetched successfully'));
});

// @desc    Get raw analytics events with pagination
// @route   GET /api/admin/analytics/events
// @access  Private/Admin
export const getAnalyticsEvents = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.eventType) filter.eventType = req.query.eventType;
    if (req.query.productId) filter.productId = req.query.productId;

    const total = await AnalyticsEvent.countDocuments(filter);
    const events = await AnalyticsEvent.find(filter)
        .populate('productId', 'name productCode')
        .populate('collectionId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json(new ApiPaginatedResponse(200, events, 'Events fetched successfully', {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    }));
});

// @desc    Get traffic sources breakdown
// @route   GET /api/admin/analytics/traffic-sources
// @access  Private/Admin
export const getTrafficSources = asyncHandler(async (req, res) => {
    const sources = await AnalyticsEvent.aggregate([
        { $match: { source: { $exists: true, $ne: '' } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    res.status(200).json(new ApiResponse(200, sources, 'Traffic sources fetched successfully'));
});

// @desc    Get size / color breakdown from WhatsApp clicks
// @route   GET /api/admin/analytics/size-color-breakdown
// @access  Private/Admin
export const getSizeColorBreakdown = asyncHandler(async (req, res) => {
    const sizeBreakdown = await AnalyticsEvent.aggregate([
        { $match: { eventType: ANALYTICS_EVENTS.WHATSAPP_CLICK, selectedSize: { $exists: true, $ne: '' } } },
        { $group: { _id: '$selectedSize', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    const colorBreakdown = await AnalyticsEvent.aggregate([
        { $match: { eventType: ANALYTICS_EVENTS.WHATSAPP_CLICK, selectedColor: { $exists: true, $ne: '' } } },
        { $group: { _id: '$selectedColor', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    res.status(200).json(new ApiResponse(200, { sizeBreakdown, colorBreakdown }, 'Size/color breakdown fetched successfully'));
});