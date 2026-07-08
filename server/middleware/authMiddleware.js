import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { AdminUser } from '../models/AdminUser.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ROLES } from '../utils/constants.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AdminUser.findById(decoded._id).select('-passwordHash');

        if (!user || !user.isActive) {
            throw new ApiError(401, 'Not authorized, user disabled or not found');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, 'Not authorized, token failed');
    }
});

export const superAdmin = (req, res, next) => {
    if (req.user && req.user.role === ROLES.SUPER_ADMIN) {
        next();
    } else {
        throw new ApiError(403, 'Not authorized as super admin');
    }
};
