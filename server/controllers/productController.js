import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiPaginatedResponse, ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteImageFromCloudinary } from '../services/cloudinaryService.js';
import slugify from 'slugify';

// @desc    Get all products (Admin view - includes soft deleted or hidden)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    // isDeleted filter: admin can explicitly request deleted or non-deleted products
    // Default to non-deleted for normal product management
    if (req.query.isDeleted === 'true') {
        query.isDeleted = true;
    } else if (req.query.isDeleted === 'false') {
        query.isDeleted = false;
    } else {
        // Default: show non-deleted only (normal management view)
        query.isDeleted = false;
    }

    // Admin can search by term
    if (req.query.search) {
        query.$text = { $search: req.query.search };
    }

    // Filter by category (accepts ObjectId or slug)
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Availability filter
    if (req.query.isAvailable === 'true') query.isAvailable = true;
    if (req.query.isAvailable === 'false') query.isAvailable = false;

    // Featured filter
    if (req.query.isFeatured === 'true') query.isFeatured = true;

    // New Arrival filter
    if (req.query.isNewArrival === 'true') query.isNewArrival = true;

    // Sorting
    const sortMap = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        name: { name: 1 },
        display_order: { displayOrder: 1 },
    };
    const sortQuery = sortMap[req.query.sort] || { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

    res.status(200).json(new ApiPaginatedResponse(200, products, 'Products fetched successfully', {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    }));
});

// @desc    Get single product by ID (Admin)
// @route   GET /api/admin/products/:id
// @access  Private/Admin
export const getAdminProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('category', 'name slug')
        .populate('collections', 'name slug');

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { name, productCode } = req.body;

    const codeExists = await Product.findOne({ productCode });
    if (codeExists) {
        throw new ApiError(400, 'Product code already exists');
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Validate duplicate slug
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
        throw new ApiError(400, 'Product with this name results in a duplicate slug. Please use a unique name.');
    }

    const product = await Product.create({
        ...req.body,
        slug
    });

    res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const { name, productCode } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    if (productCode && productCode !== product.productCode) {
        const codeExists = await Product.findOne({ productCode, _id: { $ne: product._id } });
        if (codeExists) {
            throw new ApiError(400, 'Product code already exists');
        }
    }

    if (name && name !== product.name) {
        req.body.slug = slugify(name, { lower: true, strict: true });
        const slugExists = await Product.findOne({ slug: req.body.slug, _id: { $ne: product._id } });
        if (slugExists) {
            throw new ApiError(400, 'Product name results in a duplicate slug');
        }
    }

    // Availability is automatically handled by the pre-save hook in the model 
    // when variants are updated. But since findByIdAndUpdate doesn't trigger pre-save hooks
    // by default for some updates, we fetch, update, and save.

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

// @desc    Soft delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const softDeleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

    res.status(200).json(new ApiResponse(200, null, 'Product soft deleted successfully'));
});

// @desc    Restore soft deleted product
// @route   PATCH /api/admin/products/:id/restore
// @access  Private/Admin
export const restoreProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    product.isDeleted = false;
    product.deletedAt = null;
    await product.save();

    res.status(200).json(new ApiResponse(200, null, 'Product restored successfully'));
});

// @desc    Permanently delete product (and Cloudinary images)
// @route   DELETE /api/admin/products/:id/permanent
// @access  Private/Admin
export const permanentDeleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    // Clean up images from Cloudinary
    if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map(img => deleteImageFromCloudinary(img.publicId));
        await Promise.all(deletePromises);
    }

    await product.deleteOne();

    res.status(200).json(new ApiResponse(200, null, 'Product permanently deleted successfully'));
});
