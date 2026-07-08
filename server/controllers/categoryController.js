import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        throw new ApiError(400, 'Category already exists');
    }

    const slug = slugify(name, { lower: true, strict: true });
    
    const category = await Category.create({
        ...req.body,
        slug
    });

    res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    if (name && name !== category.name) {
        const categoryExists = await Category.findOne({ name, _id: { $ne: category._id } });
        if (categoryExists) {
            throw new ApiError(400, 'Category name already in use');
        }
        req.body.slug = slugify(name, { lower: true, strict: true });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(new ApiResponse(200, updatedCategory, 'Category updated successfully'));
});

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    const productCount = await Product.countDocuments({ category: req.params.id, isDeleted: false });
    if (productCount > 0) {
        throw new ApiError(400, `Cannot delete "${category.name}". ${productCount} product(s) are using this category. Reassign them first.`);
    }

    await category.deleteOne();
    res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});
