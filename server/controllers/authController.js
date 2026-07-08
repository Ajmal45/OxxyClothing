import { AdminUser } from '../models/AdminUser.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Auth admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await AdminUser.findOne({ email });

    if (user && (await user.isPasswordCorrect(password))) {
        if (!user.isActive) {
            throw new ApiError(401, 'Your account has been deactivated');
        }

        const token = user.generateAccessToken();

        // Set cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        res.cookie('jwt', token, cookieOptions);

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        res.status(200).json(
            new ApiResponse(200, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, 'Logged in successfully')
        );
    } else {
        // Generic error for both email and password for security
        throw new ApiError(401, 'Invalid email or password');
    }
});

// @desc    Logout admin / clear cookie
// @route   POST /api/admin/auth/logout
// @access  Private
export const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

// @desc    Get admin profile
// @route   GET /api/admin/auth/me
// @access  Private
export const getAdminProfile = asyncHandler(async (req, res) => {
    const user = await AdminUser.findById(req.user._id).select('-passwordHash');

    if (user) {
        res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
    } else {
        throw new ApiError(404, 'Admin not found');
    }
});
