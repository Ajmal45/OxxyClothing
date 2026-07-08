import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Collection } from '../models/Collection.js';
import { HomepageContent } from '../models/HomepageContent.js';
import { Setting } from '../models/Setting.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiPaginatedResponse, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { SORT_OPTIONS } from '../utils/constants.js';

// @desc    Get all active products with filtering and pagination
// @route   GET /api/products
// @access  Public
export const getPublicProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false }; // Only active products

    // Search
    if (req.query.search) {
        query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
        const category = await Category.findOne({ slug: req.query.category });
        if (category) query.category = category._id;
    }

    // Collection filter
    if (req.query.collection) {
        const collection = await Collection.findOne({ slug: req.query.collection });
        if (collection) query.collections = collection._id;
    }

    // Filters for variants
    if (req.query.size || req.query.color) {
        query.variants = { $elemMatch: { isActive: true, stock: { $gt: 0 } } };
        if (req.query.size) query.variants.$elemMatch.size = new RegExp(`^${req.query.size}$`, 'i');
        if (req.query.color) query.variants.$elemMatch.color = new RegExp(`^${req.query.color}$`, 'i');
    }

    // Additional filters
    if (req.query.isAvailable === 'true') query.isAvailable = true;
    if (req.query.isFeatured === 'true') query.isFeatured = true;
    if (req.query.isNewArrival === 'true') query.isNewArrival = true;
    
    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // Default Newest
    if (req.query.sort) {
        const sortKey = SORT_OPTIONS[req.query.sort.toUpperCase()];
        if (sortKey) {
            if (sortKey.startsWith('-')) {
                sortQuery = { [sortKey.substring(1)]: -1 };
            } else {
                sortQuery = { [sortKey]: 1 };
            }
        }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

    res.status(200).json(new ApiPaginatedResponse(200, products, 'Products fetched successfully', {
        page, limit, total, pages: Math.ceil(total / limit)
    }));
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = asyncHandler(async (req, res) => {
    const products = await Product.find({ isDeleted: false, isNewArrival: true })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(8);
    res.status(200).json(new ApiResponse(200, products, 'New arrivals fetched successfully'));
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isDeleted: false, isFeatured: true })
        .populate('category', 'name slug')
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(8);
    res.status(200).json(new ApiResponse(200, products, 'Featured products fetched successfully'));
});

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isDeleted: false })
        .populate('category', 'name slug')
        .populate('collections', 'name slug');

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
export const getPublicCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

// @desc    Get all active collections
// @route   GET /api/collections
// @access  Public
export const getPublicCollections = asyncHandler(async (req, res) => {
    const collections = await Collection.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(200).json(new ApiResponse(200, collections, 'Collections fetched successfully'));
});

// @desc    Get collection by slug
// @route   GET /api/collections/:slug
// @access  Public
export const getCollectionBySlug = asyncHandler(async (req, res) => {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true });
    if (!collection) {
        throw new ApiError(404, 'Collection not found');
    }
    res.status(200).json(new ApiResponse(200, collection, 'Collection fetched successfully'));
});

// @desc    Get homepage content
// @route   GET /api/homepage
// @access  Public
export const getPublicHomepage = asyncHandler(async (req, res) => {
    const homepage = await HomepageContent.findOne()
        .populate({
            path: 'featuredCollection',
            match: { isActive: true }
        })
        .populate({
            path: 'selectedFeaturedProducts',
            match: { isDeleted: false }
        });
    res.status(200).json(new ApiResponse(200, homepage || {}, 'Homepage fetched successfully'));
});

// @desc    Get public settings
// @route   GET /api/settings/public
// @access  Public
export const getPublicSettings = asyncHandler(async (req, res) => {
    const settings = await Setting.findOne();
    res.status(200).json(new ApiResponse(200, settings || {}, 'Settings fetched successfully'));
});
