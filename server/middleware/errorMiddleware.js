import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];

    // Normalize Mongoose errors
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        message = 'Resource not found / Invalid ObjectId';
    } else if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
        errors = [err.keyValue];
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    const response = new ApiResponse(statusCode, null, message);
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    
    // Attach validation errors array if present
    if (errors.length > 0) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};
