import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            
            throw new ApiError(400, errorMessage, errors);
        }

        req.body = value;
        next();
    };
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            throw new ApiError(400, errorMessage);
        }

        req.query = value;
        next();
    };
};
