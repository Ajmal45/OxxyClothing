import { HomepageContent } from '../models/HomepageContent.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get homepage content
// @route   GET /api/admin/homepage
// @access  Private/Admin
export const getHomepageContent = asyncHandler(async (req, res) => {
    let homepage = await HomepageContent.findOne()
        .populate('featuredCollection')
        .populate('selectedFeaturedProducts');

    // If no homepage content exists yet, return an empty object or defaults
    if (!homepage) {
        homepage = {};
    }

    res.status(200).json(new ApiResponse(200, homepage, 'Homepage content fetched successfully'));
});

// @desc    Update homepage content
// @route   PUT /api/admin/homepage
// @access  Private/Admin
export const updateHomepageContent = asyncHandler(async (req, res) => {
    let homepage = await HomepageContent.findOne();

    if (homepage) {
        homepage = await HomepageContent.findByIdAndUpdate(
            homepage._id,
            req.body,
            { new: true, runValidators: true }
        ).populate('featuredCollection').populate('selectedFeaturedProducts');
    } else {
        homepage = await HomepageContent.create(req.body);
    }

    res.status(200).json(new ApiResponse(200, homepage, 'Homepage content updated successfully'));
});
