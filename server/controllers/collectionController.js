import { Collection } from '../models/Collection.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

// @desc    Get all collections
// @route   GET /api/admin/collections
// @access  Private/Admin
export const getCollections = asyncHandler(async (req, res) => {
    const collections = await Collection.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();

    // Attach product count to each collection
    const collectionIds = collections.map((c) => c._id);
    const counts = await Product.aggregate([
        { $match: { collections: { $in: collectionIds }, isDeleted: false } },
        { $group: { _id: '$collections', count: { $sum: 1 } } },
        { $unwind: '$_id' },
    ]);
    const countMap = {};
    counts.forEach((c) => { countMap[c._id.toString()] = c.count; });

    const result = collections.map((c) => ({
        ...c,
        productCount: countMap[c._id.toString()] || 0,
    }));

    res.status(200).json(new ApiResponse(200, result, 'Collections fetched successfully'));
});

// @desc    Create a collection
// @route   POST /api/admin/collections
// @access  Private/Admin
export const createCollection = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const collectionExists = await Collection.findOne({ name });
    if (collectionExists) {
        throw new ApiError(400, 'Collection already exists');
    }

    const slug = slugify(name, { lower: true, strict: true });
    
    const collection = await Collection.create({
        ...req.body,
        slug
    });

    res.status(201).json(new ApiResponse(201, collection, 'Collection created successfully'));
});

// @desc    Update a collection
// @route   PUT /api/admin/collections/:id
// @access  Private/Admin
export const updateCollection = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        throw new ApiError(404, 'Collection not found');
    }

    if (name && name !== collection.name) {
        const collectionExists = await Collection.findOne({ name, _id: { $ne: collection._id } });
        if (collectionExists) {
            throw new ApiError(400, 'Collection name already in use');
        }
        req.body.slug = slugify(name, { lower: true, strict: true });
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, updatedCollection, 'Collection updated successfully'));
});

// @desc    Delete a collection
// @route   DELETE /api/admin/collections/:id
// @access  Private/Admin
export const deleteCollection = asyncHandler(async (req, res) => {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        throw new ApiError(404, 'Collection not found');
    }

    await collection.deleteOne();
    res.status(200).json(new ApiResponse(200, null, 'Collection deleted successfully'));
});
