import { Setting } from '../models/Setting.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = asyncHandler(async (req, res) => {
    let settings = await Setting.findOne();

    if (!settings) {
        settings = {};
    }

    res.status(200).json(new ApiResponse(200, settings, 'Settings fetched successfully'));
});

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Setting.findOne();

    if (settings) {
        settings = await Setting.findByIdAndUpdate(
            settings._id,
            req.body,
            { new: true, runValidators: true }
        );
    } else {
        settings = await Setting.create(req.body);
    }

    res.status(200).json(new ApiResponse(200, settings, 'Settings updated successfully'));
});
